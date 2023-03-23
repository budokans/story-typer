import { useCountUp } from "use-count-up";
import { Text } from "@chakra-ui/react";
import { ReactElement } from "react";

interface CountUpProps {
  readonly start: number;
  readonly end: number;
  readonly duration: number;
}

export const CountUp = ({
  start,
  end,
  duration,
}: CountUpProps): ReactElement => {
  const { value } = useCountUp({
    isCounting: true,
    start: start,
    end: end,
    duration: duration,
  });

  return (
    <Text
      display="inline"
      fontWeight="400"
      sx={{ fontVariantNumeric: "tabular-nums" }}
    >
      {value}
    </Text>
  );
};
