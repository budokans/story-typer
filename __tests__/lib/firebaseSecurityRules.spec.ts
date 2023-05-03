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
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), otherUserDocPath), otherUser);
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
});
