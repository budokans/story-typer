import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestContext,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import fs from "fs";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

/**
 * @jest-environment node
 */

let testEnv: RulesTestEnvironment;
let authUserFirestore: ReturnType<RulesTestContext["firestore"]>;
let unAuthUserFirestore: ReturnType<RulesTestContext["firestore"]>;

// User setup
const authUserId = "authUserId";
const authUserDocPath = `users/${authUserId}`;
const otherUserId = "testUserId";
const otherUserDocPath = `users/${otherUserId}`;
type UserReadOnlyFields = {
  readonly id: string;
  readonly email: string;
  readonly registeredDate: string;
  readonly lastSignInTime: string;
};
type UserTestUpdateField = {
  readonly name: string;
};
type TestUser = UserReadOnlyFields & UserTestUpdateField;
const buildTestUser = (id: string): TestUser => ({
  id: id,
  name: "testUser",
  email: "testEmail",
  registeredDate: "testRegisteredDate",
  lastSignInTime: "testLastSignInTime",
});
const authUser = buildTestUser(authUserId);
const otherUser = buildTestUser(otherUserId);

// Favorites setup
const userOwnedFavoriteDocPath = "favorites/userOwnedFavoriteTestId";
const otherUserExistingFavoritesDocPath = "favorites/otherUserFavoriteTestId";
const newOtherUserFavoriteDocPath = "favorites/newOtherUserFavoriteId";
type TestFavorite = {
  readonly userId: string;
};
const buildTestFavorite = (userId: string): TestFavorite => ({
  userId,
});
const userOwnedFavorite = buildTestFavorite(authUserId);
const otherUserExistingFavorite = buildTestFavorite(otherUserId);
const newOtherUserFavorite = buildTestFavorite("newOtherUserId");

// PrevGames setup
const userOwnedPrevGameDocPath = "favorites/userOwnedPrevGameTestId";
const otherUserExistingPrevGamesDocPath = "favorites/otherUserPrevGameTestId";
const newOtherUserPrevGameDocPath = "favorites/newOtherUserPrevGameId";
type TestPrevGame = {
  readonly userId: string;
};
const buildTestPrevGame = (userId: string): TestPrevGame => ({
  userId,
});
const userOwnedPrevGame = buildTestPrevGame(authUserId);
const otherUserExistingPrevGame = buildTestPrevGame(otherUserId);
const newOtherUserPrevGame = buildTestPrevGame("newOtherUserId");

// Metadata setup
const metadataDocPath = "metadata/data";
const testMetadataDoc = {
  storiesCount: 1000,
};

describe("Security Rules", () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "story-typer",
      firestore: {
        rules: fs.readFileSync("firestore.rules", "utf8"),
        host: "localhost",
        port: 8080,
      },
    });

    await testEnv.clearFirestore();

    // Create existing data
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), otherUserDocPath), otherUser);
    });

    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(
        doc(context.firestore(), otherUserExistingFavoritesDocPath),
        otherUserExistingFavorite
      );
    });

    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(
        doc(context.firestore(), otherUserExistingPrevGamesDocPath),
        otherUserExistingPrevGame
      );
    });

    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), metadataDocPath), testMetadataDoc);
    });

    authUserFirestore = testEnv.authenticatedContext(authUserId).firestore();
    unAuthUserFirestore = testEnv.unauthenticatedContext().firestore();
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  // Random Collection
  test("Unauthorised users cannot CRUD in a random collection", async () => {
    // Create
    await assertFails(
      setDoc(doc(unAuthUserFirestore, `random/collection`), {
        id: authUserId,
      })
    );
    // Read
    await assertFails(getDoc(doc(unAuthUserFirestore, "random/collection")));
    // Delete
    await assertFails(deleteDoc(doc(unAuthUserFirestore, "random/collection")));
  });

  // Users Collection
  test("Unauthorised users cannot CRUD in users collection", async () => {
    // Create
    await assertFails(
      setDoc(doc(unAuthUserFirestore, authUserDocPath), {
        id: authUserId,
      })
    );
    // Read
    await assertFails(getDoc(doc(unAuthUserFirestore, `users/${otherUserId}`)));
    // Update
    await assertFails(
      setDoc(doc(unAuthUserFirestore, otherUserDocPath), {
        ...otherUser,
        personalBest: 1,
      })
    );
    // Delete
    await assertFails(deleteDoc(doc(unAuthUserFirestore, otherUserDocPath)));
  });

  test("Authorised users cannot CRUD another user's user document", async () => {
    // Create
    await assertFails(
      setDoc(doc(authUserFirestore, otherUserDocPath), {
        id: "testUserId",
      })
    );
    // Read
    await assertFails(getDoc(doc(authUserFirestore, otherUserDocPath)));
    // Update
    await assertFails(
      setDoc(doc(authUserFirestore, otherUserDocPath), {
        ...otherUser,
        personalBest: 1,
      })
    );
    // Delete
    await assertFails(deleteDoc(doc(authUserFirestore, otherUserDocPath)));
  });

  test("Authorised users can create and read their own user document", async () => {
    // Create
    await assertSucceeds(
      setDoc(doc(authUserFirestore, authUserDocPath), authUser)
    );
    // Read
    await assertSucceeds(getDoc(doc(authUserFirestore, authUserDocPath)));
  });

  test("Authorised users can update only certain fields in their own user document", async () => {
    // Succeed when updating non-readonly fields
    const updatedUser = {
      ...authUser,
      name: "newName",
    };

    await assertSucceeds(
      setDoc(doc(authUserFirestore, authUserDocPath), updatedUser)
    );

    // Fail when updating readonly fields
    await assertFails(
      setDoc(doc(authUserFirestore, authUserDocPath), {
        ...updatedUser,
        id: "newId",
      })
    );
    await assertFails(
      setDoc(doc(authUserFirestore, authUserDocPath), {
        ...updatedUser,
        email: "newEmail",
      })
    );
    await assertFails(
      setDoc(doc(authUserFirestore, authUserDocPath), {
        ...updatedUser,
        lastSignInTime: "newLastSignInTime",
      })
    );
    await assertFails(
      setDoc(doc(authUserFirestore, authUserDocPath), {
        ...updatedUser,
        registeredDate: "newRegisteredDate",
      })
    );

    // Fail when adding a new field
    await assertFails(
      setDoc(doc(authUserFirestore, authUserDocPath), {
        ...updatedUser,
        newField: "newField",
      })
    );
  });

  test("Authorised users cannot delete their user document", async () => {
    await assertFails(deleteDoc(doc(authUserFirestore, authUserDocPath)));
  });

  // Favorites Collection
  test("Unauthorised users cannot CRUD in favorites collection", async () => {
    // Create Favorite
    await assertFails(
      setDoc(
        doc(unAuthUserFirestore, userOwnedFavoriteDocPath),
        userOwnedFavorite
      )
    );
    // Read
    await assertFails(
      getDoc(doc(unAuthUserFirestore, otherUserExistingFavoritesDocPath))
    );
    // Update
    await assertFails(
      setDoc(doc(unAuthUserFirestore, otherUserExistingFavoritesDocPath), {
        ...otherUserExistingFavorite,
        userId: "newUserId",
      })
    );
    // Delete
    await assertFails(
      deleteDoc(doc(unAuthUserFirestore, otherUserExistingFavoritesDocPath))
    );
  });

  test("Authorised users cannot CRUD another user's favorites document", async () => {
    // Create
    await assertFails(
      setDoc(
        doc(authUserFirestore, newOtherUserFavoriteDocPath),
        newOtherUserFavorite
      )
    );
    // Read
    await assertFails(
      getDoc(doc(authUserFirestore, otherUserExistingFavoritesDocPath))
    );
    // Update
    await assertFails(
      setDoc(doc(authUserFirestore, otherUserExistingFavoritesDocPath), {
        ...otherUserExistingFavorite,
        userId: "newUserId",
      })
    );
    // Delete
    await assertFails(
      deleteDoc(doc(authUserFirestore, otherUserExistingFavoritesDocPath))
    );
  });

  test("Authorised users can create and read their own favorites documents", async () => {
    // Create
    await assertSucceeds(
      setDoc(
        doc(authUserFirestore, userOwnedFavoriteDocPath),
        userOwnedFavorite
      )
    );
    // Read
    await assertSucceeds(
      getDoc(doc(authUserFirestore, userOwnedFavoriteDocPath))
    );
  });

  test("Authorised users cannot update their own favorites documents", async () => {
    await assertFails(
      setDoc(doc(authUserFirestore, userOwnedFavoriteDocPath), {
        ...userOwnedFavorite,
        userId: "newUserId",
      })
    );
  });

  test("Authorised users can delete their own favorites documents", async () => {
    await assertSucceeds(
      deleteDoc(doc(authUserFirestore, userOwnedFavoriteDocPath))
    );
  });

  // PrevGames Collection
  test("Unauthorised users cannot CRUD in prevGames collection", async () => {
    // Create Favorite
    await assertFails(
      setDoc(
        doc(unAuthUserFirestore, userOwnedPrevGameDocPath),
        userOwnedPrevGame
      )
    );
    // Read
    await assertFails(
      getDoc(doc(unAuthUserFirestore, otherUserExistingPrevGamesDocPath))
    );
    // Update
    await assertFails(
      setDoc(doc(unAuthUserFirestore, otherUserExistingPrevGamesDocPath), {
        ...otherUserExistingPrevGame,
        userId: "newUserId",
      })
    );
    // Delete
    await assertFails(
      deleteDoc(doc(unAuthUserFirestore, otherUserExistingPrevGamesDocPath))
    );
  });

  test("Authorised users cannot CRUD another user's prevGames document", async () => {
    // Create
    await assertFails(
      setDoc(
        doc(authUserFirestore, newOtherUserPrevGameDocPath),
        newOtherUserPrevGame
      )
    );
    // Read
    await assertFails(
      getDoc(doc(authUserFirestore, otherUserExistingPrevGamesDocPath))
    );
    // Update
    await assertFails(
      setDoc(doc(authUserFirestore, otherUserExistingPrevGamesDocPath), {
        ...otherUserExistingPrevGame,
        userId: "newUserId",
      })
    );
    // Delete
    await assertFails(
      deleteDoc(doc(authUserFirestore, otherUserExistingPrevGamesDocPath))
    );
  });

  test("Authorised users can create and read their own prevGames documents", async () => {
    // Create
    await assertSucceeds(
      setDoc(
        doc(authUserFirestore, userOwnedPrevGameDocPath),
        userOwnedPrevGame
      )
    );
    // Read
    await assertSucceeds(
      getDoc(doc(authUserFirestore, userOwnedPrevGameDocPath))
    );
  });

  test("Authorised users cannot update their own prevGames documents", async () => {
    await assertFails(
      setDoc(doc(authUserFirestore, userOwnedPrevGameDocPath), {
        ...userOwnedPrevGame,
        userId: "newUserId",
      })
    );
  });

  test("Authorised users can delete their own prevGames documents", async () => {
    await assertSucceeds(
      deleteDoc(doc(authUserFirestore, userOwnedPrevGameDocPath))
    );
  });

  // Metadata Collection
  test("No user can create or update in metadata collection", async () => {
    // Create
    await assertFails(
      setDoc(doc(authUserFirestore, "metadata/otherData"), { some: "data" })
    );
    // Update
    await assertFails(
      setDoc(doc(authUserFirestore, metadataDocPath), {
        ...testMetadataDoc,
        storiesCount: 1001,
      })
    );
  });

  test("Unauthorised users can read data document in metadata collection", async () => {
    await assertSucceeds(getDoc(doc(unAuthUserFirestore, metadataDocPath)));
  });

  test("No user can delete in metadata collection", async () => {
    await assertFails(deleteDoc(doc(authUserFirestore, metadataDocPath)));
  });
});
