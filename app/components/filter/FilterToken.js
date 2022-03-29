import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { UserContext } from '../../util/UserManager';
import colors from '../../config/colors';

const FilterToken = ({ label, handleFilter }) => {
  const { theme, activeFilter, setActiveFilter } =
    React.useContext(UserContext);
  const [selected, setSelected] = useState(false);

  const handleTouch = () => {
    let filterQuery;
    if (selected) {
      filterQuery = '';
    } else {
      filterQuery = label;
    }
    setActiveFilter(filterQuery);
    handleFilter(filterQuery);
    setSelected(!selected);
  };

  const selectedStyles = StyleSheet.create({
    containerTokenSelectedlight: {
      backgroundColor:
        activeFilter === label && selected ? colors.primary : colors.light,
    },
    containerTokenSelecteddark: {
      backgroundColor:
        activeFilter === label && selected ? colors.primary : colors.darkgray,
    },
    textTokenSelectedlight: {
      color: activeFilter === label && selected ? colors.light : colors.dark,
    },
    textTokenSelecteddark: {
      color: colors.light,
    },
  });

  return (
    <View style={styles.containerTop}>
      <TouchableOpacity onPress={handleTouch}>
        <View
          style={[
            styles.containerToken,
            selectedStyles[`containerTokenSelected${theme}`],
          ]}
        >
          <Text
            style={[
              styles.textToken,
              selectedStyles[`textTokenSelected${theme}`],
            ]}
          >
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FilterToken;

const styles = StyleSheet.create({
  containerTop: {
    paddingRight: 5,
  },
  containerToken: {
    display: 'flex',
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textToken: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
