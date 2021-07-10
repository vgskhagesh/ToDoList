import React, {useState, createRef, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-community/async-storage';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {OutlinedTextField} from 'rn-material-ui-textfield';

// const wait = timeout => {
//   return new Promise(resolve => setTimeout(resolve, timeout));
// };

const Index = () => {
  const [isDark, setIsDark] = useState(useColorScheme() === 'dark');
  const inputRef = createRef();
  const [input, setInput] = useState('');
  const [toDoList, setToDoList] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    const _retrieveData = async () => {
      try {
        let localStorageIsDark = await AsyncStorage.getItem('isDark');
        localStorageIsDark = await JSON.parse(localStorageIsDark);
        if (localStorageIsDark !== null) {
          setIsDark(localStorageIsDark);
          console.log(typeof localStorageIsDark);
        }

        let localStorageToDoList = await AsyncStorage.getItem('toDoList');
        localStorageToDoList = await JSON.parse(localStorageToDoList);
        if (localStorageToDoList !== null) {
          setToDoList(localStorageToDoList);
          console.log(typeof localStorageToDoList);
        }
      } catch (error) {
        // Error retrieving data
      }
    };
    _retrieveData();
  }, []);

  const onRefresh = React.useCallback(() => {
    console.log(toDoList);
    console.log('refresh');
    setRefreshing(true);
    //wait(1000).then(() => handleClearList());
    Alert.alert(null, 'Clear All', [
      {
        text: 'Cancel',
        onPress: () => setRefreshing(false),
        // style: styles.alertButton,
      },
      {
        text: 'OK',
        onPress: () => {
          setToDoList([]);
          setRefreshing(false);
        },
      },
    ]);
  }, []);

  const handleAdd = () => {
    // console.log(field.value());
    if (input) {
      setToDoList(toDoList => [{selected: false, label: input}, ...toDoList]);
      setInput('');
    }
  };

  const handleSelect = index => {
    if (!toDoList[index].selected) {
      const item = toDoList[index];
      const List = toDoList.filter((_, i) => i !== index);
      setToDoList([...List, {...item, selected: true}]);
    } else {
      setToDoList([
        {...toDoList[index], selected: false},
        ...toDoList.filter((_, i) => i !== index),
      ]);
    }
  };

  const handleLongPress = index => {
    console.log('LongPress: ', index);
    setToDoList(toDoList.filter((_, i) => i !== index));
  };

  const handleUnSelectAll = () => {
    console.log('unselectAll', toDoList.length);
    setToDoList([
      ...toDoList.map((item, index) => ({...item, selected: false})),
    ]);

    console.log(toDoList.map((item, index) => ({...item, selected: false})));
  };

  const handleSave = () => {
    const _storeData = async () => {
      try {
        await AsyncStorage.setItem('toDoList', JSON.stringify(toDoList));
        await AsyncStorage.setItem('isDark', JSON.stringify(isDark));
        Alert.alert(null, 'Saved');
      } catch (error) {
        // console.log(error);
      }
    };
    _storeData();
  };

  useEffect(() => {}, [toDoList]);

  return (
    <SafeAreaView
      style={{
        ...styles.background,
        backgroundColor: isDark ? Colors.darker : Colors.lighter,
      }}>
      <View style={{...styles.background}}>
        <View style={styles.navbar}>
          <Text style={styles.navbarTitle}>To Do List</Text>
          <Switch
            style={styles.darkMode}
            trackColor={{false: '#767577', true: '#767577'}}
            thumbColor={isDark ? '#3' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setIsDark(!isDark)}
            value={isDark}
          />
        </View>
        <View style={styles.addContainer}>
          <OutlinedTextField
            containerStyle={styles.inputField}
            textColor={isDark ? Colors.white : Colors.black}
            baseColor={isDark ? '#878683' : '#bebebe'}
            label="To Do"
            value={input}
            onChangeText={val => setInput(val)}
            onSubmitEditing={handleAdd}
            ref={inputRef}
          />
          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.toDoList}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {toDoList &&
              toDoList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={handleSelect.bind(this, index)}
                  onLongPress={handleLongPress.bind(this, index)}
                  style={{
                    ...styles.toDoItem,
                    borderColor: isDark ? '#878683' : '#bebebe',
                  }}>
                  <View style={styles.checkBox}>
                    <CheckBox
                      value={item.selected}
                      selected={item.selected}
                      // onChange={handleSelect.bind(this, index)}
                      onChange={newValue => console.log(newValue)}
                      disabled={true}
                      tintColors={'green'}
                    />
                  </View>
                  <Text
                    style={{
                      ...styles.toDoItemText,
                      color: isDark ? Colors.white : Colors.black,
                      textDecorationLine: item.selected
                        ? 'line-through'
                        : 'none',
                    }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
        <View
          style={{
            ...styles.footer,
            backgroundColor: isDark ? '#242727' : '#E2F2F3',
          }}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={handleUnSelectAll}>
            <Text style={{color: isDark ? Colors.white : Colors.dark}}>
              Un-Select All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={handleSave}>
            <Text style={{color: isDark ? Colors.white : Colors.dark}}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  navbar: {
    height: 50,
    backgroundColor: '#4b0082',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navbarTitle: {
    color: 'white',
    marginLeft: 10,
    fontSize: 18,
  },
  darkMode: {
    marginRight: 10,
  },
  addContainer: {
    marginTop: 18,
    marginHorizontal: 8,
    display: 'flex',
    flexDirection: 'row',
  },
  inputField: {
    flex: 6,
    paddingBottom: 0,
  },
  button: {
    marginLeft: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'blue',
    height: 54,
  },
  buttonText: {
    color: '#bebebe',
  },

  toDoList: {
    marginTop: 10,
    flex: 1,
  },
  scroll: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
  },
  toDoItem: {
    width: '80%',
    marginTop: 4,
    paddingHorizontal: 20,
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
  },
  toDoItemText: {
    marginLeft: 10,
  },
  checkBox: {},

  footer: {
    height: 40,
    width: '100%',
    backgroundColor: '#E2F2F3',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Index;
