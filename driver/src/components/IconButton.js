import React from 'react';
import {
    Pressable,
    StyleSheet,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ICON_LIBRARIES = {
    Feather: () => Feather,
    MaterialCommunityIcons: () => MaterialCommunityIcons,
    // add more libraries as needed
};

const IconButton = ({
    icon,
    iconFamily = 'Feather',
    variant = 'contained',
    size = 'medium',
    iconColor = 'white',
    roundness = 'medium',
    style = {},
    onPress,
    ...rest
}) => {
    const Icon = ICON_LIBRARIES[iconFamily]();
    const iconSize = size === 'big' ? 24 : size === 'medium' ? 16 : 12;
    const buttonSize = size === 'big' ? 48 : size === 'medium' ? 36 : 24;

    const buttonStyles = [
        styles.button,
        styles[`${variant}Button`],
        styles[`${roundness}Roundness`],
        { width: buttonSize, height: buttonSize },
        style,
    ];

    return (
        <Pressable
            {...rest}
            onPress={onPress}
            style={({ pressed }) => [
                buttonStyles,
                pressed && styles.buttonPressed,
                pressed && styles.shadow,
            ]}>
            <Icon name={icon} size={iconSize} color={iconColor} />
        </Pressable>
    );
};

export default IconButton;

const styles = StyleSheet.create({
    button: {
        borderRadius: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPressed: {
        opacity: 0.9,
    },
    containedButton: {
        backgroundColor: '#2196F3',
    },
    textButton: {
        backgroundColor: 'transparent',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#2196F3',
    },
    fullRoundness: {
        borderRadius: 100,
    },
    mediumRoundness: {
        borderRadius: 20,
    },
    smallRoundness: {
        borderRadius: 10,
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,

        elevation: 1,
    },
});