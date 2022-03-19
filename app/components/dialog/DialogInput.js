import React from "react";
import { Button } from "react-native";
import Dialog from "react-native-dialog";

import colors from "../../config/colors";

const DialogInput = ({ visible, cancel, add, value, onChangeText }) => {
  return (
    <Dialog.Container visible={visible}>
      <Dialog.Title>Vyvoriť playlist</Dialog.Title>
      <Dialog.Description>Zadajte názov nového playlistu</Dialog.Description>
      <Dialog.Input
        autoFocus={true}
        placeholder="Názov"
        value={value}
        onChangeText={(input) => onChangeText(input)}
      />
      <Dialog.Button
        label="Zrušiť"
        onPress={cancel}
        style={{ color: colors.red }}
      />
      <Dialog.Button label="Pridať" onPress={add} />
    </Dialog.Container>
  );
};

export default DialogInput;
