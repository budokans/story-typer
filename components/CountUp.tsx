import { useCountUp } from "use-count-up";
import { Text } from "@chakra-ui/react";

interface CountUpProps {
  start: number;
  end: number;
  duration: number;
}

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
