import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase, Student, DEPARTMENTS } from '../lib/supabase';

interface StudentFormProps {
  student?: Student;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function StudentForm({ student, onSuccess, onCancel }: StudentFormProps) {
  const [firstName, setFirstName] = useState(student?.first_name || '');
  const [lastName, setLastName] = useState(student?.last_name || '');
  const [age, setAge] = useState(student?.age?.toString() || '');
  const [department, setDepartment] = useState(student?.department || 'CSE');
  const [otherDepartment, setOtherDepartment] = useState('');
  const [email, setEmail] = useState(student?.email || '');
  const [district, setDistrict] = useState(student?.district || '');
  const [pincode, setPincode] = useState(student?.pincode || '');
  const [address, setAddress] = useState(student?.address || '');
  const [photoUrl, setPhotoUrl] = useState(student?.photo_url || '');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Select Photo', 'Choose an option', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Gallery', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'First name is required');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'Last name is required');
      return;
    }

    setLoading(true);

    try {
      const finalDepartment = department === 'Others' ? otherDepartment : department;
      
      const studentData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        age: age ? parseInt(age, 10) : null,
        department: finalDepartment,
        email: email.trim() || null,
        district: district.trim() || null,
        pincode: pincode.trim() || null,
        address: address.trim() || null,
        photo_url: photoUrl || null,
      };

      if (student) {
        // Update existing student
        const { error } = await supabase
          .from('students')
          .update(studentData)
          .eq('id', student.id);

        if (error) throw error;
        Alert.alert('Success', 'Student updated successfully');
      } else {
        // Create new student
        const { error } = await supabase
          .from('students')
          .insert([studentData]);

        if (error) throw error;
        Alert.alert('Success', 'Student added successfully');
      }

      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Photo Section */}
      <View className="items-center mb-6 pt-4 min-h-[120px]">
        <TouchableOpacity
          onPress={showImageOptions}
          className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center overflow-hidden border-2 border-gray-300"
        >
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} className="w-full h-full" />
          ) : (
            <View className="items-center">
              <Text className="text-4xl">📷</Text>
              <Text className="text-xs text-gray-500 mt-1">Add Pic</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text className="text-sm text-gray-500 mt-2">Tap to add photo</Text>
      </View>

      {/* Name Fields */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <Text className="text-gray-700 font-medium mb-1">First Name *</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 font-medium mb-1">Last Name *</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          />
        </View>
      </View>

      {/* Age and Department */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <Text className="text-gray-700 font-medium mb-1">Age</Text>
          <TextInput
            value={age}
            onChangeText={setAge}
            placeholder="Age"
            keyboardType="numeric"
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 font-medium mb-1">Department *</Text>
          <View className="bg-white border border-gray-300 rounded-lg">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
                {DEPARTMENTS.map((dept) => (
                  <TouchableOpacity
                    key={dept}
                    onPress={() => setDepartment(dept)}
                    className={`px-4 py-3 ${
                      department === dept ? 'bg-blue-500 rounded-[6px]  ' : 'bg-white rounded-[6px] '
                    }`}
                  >
                    <Text
                      className={
                        department === dept ? 'text-white' : 'text-gray-800'
                      }
                    >
                      {dept}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>

      {/* Other Department Input */}
      {department === 'Others' && (
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-1">Specify Department *</Text>
          <TextInput
            value={otherDepartment}
            onChangeText={setOtherDepartment}
            placeholder="Enter department name"
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          />
        </View>
      )}

      {/* Email */}
      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-1">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
        />
      </View>

      {/* District and Pincode */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <Text className="text-gray-700 font-medium mb-1">District</Text>
          <TextInput
            value={district}
            onChangeText={setDistrict}
            placeholder="District"
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-700 font-medium mb-1">Pincode</Text>
          <TextInput
            value={pincode}
            onChangeText={setPincode}
            placeholder="Pincode"
            keyboardType="numeric"
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
          />
        </View>
      </View>

      {/* Address */}
      <View className="mb-6">
        <Text className="text-gray-700 font-medium mb-1">Address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Full Address"
          multiline
          numberOfLines={3}
          className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 h-24"
        />
      </View>

      {/* Buttons */}
      <View className="flex-row gap-3 mb-8">
        <TouchableOpacity
          onPress={onCancel}
          className="flex-1 bg-gray-400 py-3 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className={`flex-1 py-3 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
        >
          <Text className="text-white text-center font-semibold">
            {loading ? 'Saving...' : student ? 'Update' : 'Add Student'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
