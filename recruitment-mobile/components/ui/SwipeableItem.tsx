import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface SwipeableItemProps {
    children: React.ReactNode;
    onEdit: () => void;
    onDelete: () => void;
    containerStyle?: any;
    onSwipeableOpen?: () => void;
}

export const SwipeableItem = forwardRef(({ children, onEdit, onDelete, containerStyle, onSwipeableOpen }: SwipeableItemProps, ref) => {
    const swipeableRef = useRef<Swipeable>(null);

    useImperativeHandle(ref, () => ({
        close: () => {
            swipeableRef.current?.close();
        }
    }));

    const renderRightActions = (progress: any, dragX: any) => {
        return (
            <View className="flex-row items-center pl-2 h-full">
                <TouchableOpacity
                    className="bg-blue-500 justify-center items-center w-20 h-full rounded-l-none"
                    onPress={() => {
                        swipeableRef.current?.close();
                        onEdit();
                    }}
                >
                    <MaterialIcons name="edit" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-red-500 justify-center items-center w-20 h-full rounded-r-xl"
                    onPress={() => {
                        swipeableRef.current?.close();
                        onDelete();
                    }}
                >
                    <MaterialIcons name="delete" size={24} color="white" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <Swipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            friction={2}
            rightThreshold={40}
            containerStyle={containerStyle}
            onSwipeableOpen={onSwipeableOpen}
        >
            {children}
        </Swipeable>
    );
});
