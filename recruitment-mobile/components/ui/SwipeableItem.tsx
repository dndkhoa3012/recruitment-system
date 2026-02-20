import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface SwipeableItemProps {
    children: React.ReactNode;
    onEdit?: () => void;
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
    }), []);

    const renderRightActions = (progress: any, dragX: any) => {
        return (
            <View
                className="flex-row items-center h-full"
                style={{ width: onEdit ? 160 : 80 }}
            >
                {onEdit && (
                    <TouchableOpacity
                        className="bg-blue-500 justify-center items-center h-full"
                        style={{ width: 80 }}
                        onPress={() => {
                            swipeableRef.current?.close();
                            onEdit();
                        }}
                    >
                        <MaterialIcons name="edit" size={24} color="white" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    className="bg-red-500 justify-center items-center h-full"
                    style={{ width: 80 }}
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
            overshootRight={false}
            containerStyle={[{ overflow: 'hidden', borderRadius: 12 }, containerStyle]}
            onSwipeableOpen={onSwipeableOpen}
        >
            {children}
        </Swipeable>
    );
});

SwipeableItem.displayName = 'SwipeableItem';
