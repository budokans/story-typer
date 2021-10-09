import { useCountUp } from "use-count-up";
import { Text } from "@chakra-ui/react";
import { CountUpProps } from "./types/CountUp.types";

export const CountUp: React.FC<CountUpProps> = ({ start, end, duration }) => {
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
