import { Text, View, TextInput, Button } from "react-native";
import "./global.css"
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="flex-row justify-between w-full px-4">
        <TextInput placeholder="Type your Goal" className="border p-2 flex-1 mr-2" />
        <Button title="Add Goal" />
      </View>
      <Text className="mt-4">List of Goals</Text>
    </View>
  );
}