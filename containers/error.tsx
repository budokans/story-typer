import { Heading, Link, Text, VStack } from "@chakra-ui/react";
import { ReactElement } from "react";
import { CenterContent } from "components";
import { Error as DBError } from "db";

export const ErrorContainer = ({
  error,
}: {
  readonly error: DBError.DBError | Error;
}): ReactElement => (
  <CenterContent observeLayout furtherVerticalOffset={250}>
    <VStack spacing={8} textAlign="center">
      <Text>Noo! There was an error: </Text>

      <Heading size="lg" color="red.500">
        &quot;{error.message}&quot;
      </Heading>

      <Text>
        We are really sorry that you are experiencing this issue. Please trying
        refreshing the page, and if the issue persists, do not hesitate to
        contact the developer at{" "}
        <Link
          href="mailto:contact@stevenwebster.co"
          target="_blank"
          rel="noopener noreferrer"
        >
          contact@stevenwebster.co
        </Link>
      </Text>
    </VStack>
  </CenterContent>
);
