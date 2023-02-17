import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

const SIZE = 100;
const CIRCLE_RADIUS = 150;
type TContext = { translateX: number; translateY: number };

export default function App() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGestureEvent =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onStart: (event, context: TContext) => {
        context.translateX = translateX.value;
        context.translateY = translateY.value;
      },
      onActive: (event, context: TContext) => {
        translateX.value = event.translationX + context.translateX;
        translateY.value = event.translationY + context.translateY;
      },
      onEnd: () => {
        const distance = Math.sqrt(
          translateX.value ** 2 + translateY.value ** 2
        );
        if (distance < CIRCLE_RADIUS + SIZE / 2) {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
        }
      },
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.circle}>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={[styles.square, rStyle]} />
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: "rgba(0, 0, 256, 0.5)",
    borderRadius: 20,
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    borderColor: "rgba(0, 0, 256, 0.5)",
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
