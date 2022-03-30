import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity, Platform,
  UIManager, } from "react-native";
import { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import SwipeableItem, {
  useSwipeableItemParams,
} from "react-native-swipeable-item";

import { UserContext } from "../../util/UserManager";
import colors from "../../config/colors";

type Item = {
  number: number;
  title: string;
  category: string;
  season: string;
  text: string;
};

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { multiply, sub } = Animated;
const OVERSWIPE_DIST = 20;
const NUM_ITEMS = 20;

const PlaylistListItemDragable = (props, { item, drag, isActive }: RenderItemParams<Item>) => {
  const { theme } = React.useContext(UserContext);

  return (
    <ScaleDecorator>
      <TouchableOpacity
        onPress={props.onPress}
        onLongPress={props.item.drag}
        disabled={props.item.isActive}
        style={[styles.listItem,styles[`background${theme}`]]}
      >
          <View style={styles.containerLeftIcon}>
            <Ionicons
              name={"menu"}
              color={theme === "light" ? "black" : "white"}
            />
          </View>
          <View style={styles.containerNumber}>
            <Text style={[styles.listItemNumber, styles[`text${theme}`]]}>
              {props.item.item.number}
            </Text>
          </View>
          <View style={styles.containerName}>
            <Text
              style={[styles.listItemName, styles[`text${theme}`]]}
              numberOfLines={1}
            >
              {props.item.item.title}
            </Text>
          </View>
          <View style={styles.containerIcon}>
            <Ionicons
              name={"chevron-forward"}
              color={theme === "light" ? "black" : "white"}
            />
          </View>
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

export default PlaylistListItemDragable;

type RowItemProps = {
  item: Item;
  drag: () => void;
  itemRefs: React.MutableRefObject<Map<any, any>>;
};

function RowItem({ item, itemRefs, drag }: RowItemProps) {
  return (
    <ScaleDecorator>
      <SwipeableItem
        key={item.title}
        item={item}
        ref={(ref) => {
          if (ref && !itemRefs.current.get(item.title)) {
            itemRefs.current.set(item.title, ref);
          }
        }}
        onChange={({ open }) => {
          if (open) {
            // Close all other open items
            [...itemRefs.current.entries()].forEach(([key, ref]) => {
              if (key !== item.title && ref) ref.close();
            });
          }
        }}
        overSwipe={OVERSWIPE_DIST}
        renderUnderlayLeft={() => <UnderlayLeft drag={drag} />}
        renderUnderlayRight={() => <UnderlayRight />}
        snapPointsLeft={[50, 150, 175]}
        snapPointsRight={[175]}
      >
        <View
          style={[
            styles.row,
            { backgroundColor: colors.light, height: 40 },
          ]}
        >
          <TouchableOpacity onPressIn={drag}>
            <Text style={styles.text}>{item.text}</Text>
          </TouchableOpacity>
        </View>
      </SwipeableItem>
    </ScaleDecorator>
  );
}

const UnderlayLeft = ({ drag }: { drag: () => void }) => {
  const { item, percentOpen } = useSwipeableItemParams<Item>();
  const animStyle = useAnimatedStyle(
    () => ({
      opacity: percentOpen.value,
    }),
    [percentOpen]
  );

  return (
    <Animated.View
      style={[styles.row, styles.underlayLeft, animStyle]} // Fade in on open
    >
      <TouchableOpacity onPressIn={drag}>
        <Text style={styles.text}>{`[drag]`}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

function UnderlayRight() {
  const { close } = useSwipeableItemParams<Item>();
  return (
    <Animated.View style={[styles.row, styles.underlayRight]}>
      <TouchableOpacity onPressOut={close}>
        <Text style={styles.text}>CLOSE</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  text: {
    fontWeight: "bold",
    color: "white",
    fontSize: 32,
  },
  underlayRight: {
    flex: 1,
    backgroundColor: "teal",
    justifyContent: "flex-start",
  },
  underlayLeft: {
    flex: 1,
    backgroundColor: "tomato",
    justifyContent: "flex-end",
  },
  containerLeftIcon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerIcon: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  containerName: {
    flex: 6,
    justifyContent: "center",
  },
  containerNumber: {
    flex: 1,
    paddingHorizontal: 3,
  },
  listItem: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    flexDirection: "row",
  },
  listItemNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listItemName: {
    fontSize: 18,
  },
  textdark: {
    color: colors.light,
  },
  textlight: {
    color: colors.black,
  },
  backgroundlight: {
    backgroundColor: colors.light
  },
  backgrounddark: {
    backgroundColor: colors.dark
  }
});
