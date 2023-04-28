import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage'

export function showToast(message, position = Toast.positions.BOTTOM) {
    Toast.show(message, {
        duration: 2000,
        position: position,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
    })
}

const logprint = true;

export function logfunction(tag, message) {
    if (logprint) {
        console.log(tag, message)
    }
}

export async function _getUser() {
    let data = await AsyncStorage.getItem('USER_INFO');
    data = JSON.parse(data);
    return data;
}

export function numberWithComma(num) {
    var decimalPart;

    var array = Math.floor(num).toString().split('');
    var index = -3;
    while (array.length + index > 0) {
        array.splice(index, 0, ',');
        index -= 4;
    }

    if (2 > 0) {
        num = parseFloat(num)
        decimalPart = num.toFixed(2).split(".")[1];
        return array.join('') + "." + decimalPart;
    }
    return array.join('');
}


export const SetLocalStorage = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
    } catch (e) {
        console.log(e)
        // saving error
    }
}

export const GetLocalStorage = async (key, parse = false) => {
    try {
        let value = await AsyncStorage.getItem(key);
        if (!value) {
            return null; // handle null or empty string values
        }
        if (parse) {
            try {
                value = JSON.parse(value);
            } catch (e) {
                console.log("Parsing Error", e)
            }
        }
        // console.log("----------------key: ", value);
        return value;
    } catch (e) {
        // error reading value
    }
}

export const RemoveLocalStorage = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (e) {
        // remove error
    }

    console.log('Done.')
}
