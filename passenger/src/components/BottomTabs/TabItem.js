import { Dimensions, Pressable, StyleSheet, Text } from 'react-native';
import React, { FC, useEffect } from 'react';
import Animated, {
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
import usePath from '../../hooks/usePath';


const SCREEN_WIDTH = Dimensions.get('window').width;

const getPathXCenterByIndex = (tabPaths, index) => {
    const curves = tabPaths[index].curves;
    const startPoint = curves[0].to;
    const endPoint = curves[curves.length - 1].to;
    const centerX = (startPoint.x + endPoint.x) / 2;
    return centerX;
}

const ICON_SIZE = 25;
const LABEL_WIDTH = SCREEN_WIDTH / 4;
const AnimatedIcon = Animated.createAnimatedComponent(AntDesign);
const TabItem = ({
    label,
    icon,
    index,
    activeIndex,
    onTabPress,
}) => {
    const { curvedPaths } = usePath();
    const animatedActiveIndex = useSharedValue(activeIndex);
    const iconPosition = getPathXCenterByIndex(curvedPaths, index);
    const labelPosition = getPathXCenterByIndex(curvedPaths, index);

    const tabStyle = useAnimatedStyle(() => {
        const translateY = animatedActiveIndex.value - 1 === index ? -17 : 20;
        const iconPositionX = iconPosition - index * ICON_SIZE;
        return {
            width: ICON_SIZE,
            height: ICON_SIZE,
            transform: [
                { translateY: withTiming(translateY) },
                { translateX: iconPositionX - ICON_SIZE / 2 },
            ],
        };
    });
    const labelContainerStyle = useAnimatedStyle(() => {
        const translateY = animatedActiveIndex.value - 1 === index ? 36 : 100;
        return {
            transform: [
                { translateY: withTiming(translateY) },
                { translateX: labelPosition - LABEL_WIDTH / 2 },
            ],
        };
    });
    const iconColor = useSharedValue(
        activeIndex === index + 1 ? 'white' : 'rgba(128,128,128,0.8)',
    );

    //Adjust Icon color for this first render
    useEffect(() => {
        animatedActiveIndex.value = activeIndex;
        if (activeIndex === index + 1) {
            iconColor.value = withTiming('white');
        } else {
            iconColor.value = withTiming('rgba(128,128,128,0.8)');
        }
    }, [activeIndex]);

    const animatedIconProps = useAnimatedProps(() => ({
        color: iconColor.value,
    }));
    return (
        <>
            <Animated.View style={[tabStyle]}>
                <Pressable
                    testID={`tab${label}`}
                    //Increasing touchable Area
                    hitSlop={{ top: 30, bottom: 30, left: 50, right: 50 }}
                    onPress={onTabPress}>
                    <AnimatedIcon
                        name={icon}
                        size={25}
                        animatedProps={animatedIconProps}
                    />
                </Pressable>
            </Animated.View>
            <Animated.View style={[labelContainerStyle, styles.labelContainer]}>
                <Text style={styles.label}>{label}</Text>
            </Animated.View>
        </>
    );
};

export default TabItem;

const styles = StyleSheet.create({
    labelContainer: {
        position: 'absolute',
        alignItems: 'center',
        width: LABEL_WIDTH,
    },
    label: {
        color: 'rgba(128,128,128,0.8)',
        fontSize: 17,
    },
});