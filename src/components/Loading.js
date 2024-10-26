import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

export default function Loading() {
    return (
        <View className="absolute flex w-screen h-screen">
            <View className="absolute w-screen h-screen flex justify-center items-center bg-black opacity-10 z-10" />
            <View className="absolute w-screen h-screen flex justify-center items-center z-50" >
                <ActivityIndicator size="3xl" color="tomato" />
            </View>

        </View>
    )
}