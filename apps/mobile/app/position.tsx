import { useLocalSearchParams } from "expo-router";
import { PositionScreen } from "@/features";

export default function PositionRoute() {
  const { positionId } = useLocalSearchParams<{ positionId?: string }>();
  return <PositionScreen positionId={positionId} />;
}
