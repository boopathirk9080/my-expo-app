import './global.css';

import React, { useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import { Student } from './lib/supabase';

const HEADER_HEIGHT = 60;

function StudentListScreen({ onEdit, refreshKey }: { onEdit: (student: Student) => void; refreshKey: number }) {
  return (
    <View className="flex-1 bg-gray-50">
      
      <View className="bg-blue-600   pb-4 px-4" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 40 }}>
        <Text className="text-white text-2xl font-bold text-center">Student Records</Text>
      </View>
      <View className="flex-1">
        <StudentList onEdit={onEdit} refreshKey={refreshKey} />
      </View>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
    </View>
  );
}

function AddStudentScreen({ 
  student, 
  onSuccess, 
  onCancel 
}: { 
  student?: Student | null; 
  onSuccess: () => void; 
  onCancel: () => void;
}) {
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
      <View className="bg-blue-600 pt-8 pb-4 px-4" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 40 }}>
        <Text className="text-white text-2xl font-bold text-center">
          {student ? 'Edit Student' : 'Add New Student'}
        </Text>
      </View>
      <View className="flex-1">
        <StudentForm student={student || undefined} onSuccess={onSuccess} onCancel={onCancel} />
      </View>
    </View>
  );
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<'list' | 'add'>('list');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setCurrentTab('add');
  };

  const handleSuccess = () => {
    setSelectedStudent(null);
    setRefreshKey(prev => prev + 1);
    setCurrentTab('list');
  };

  const handleCancel = () => {
    setSelectedStudent(null);
    setCurrentTab('list');
  };

  const handleAddPress = () => {
    setSelectedStudent(null);
    setCurrentTab('add');
  };

  return (
    <NavigationContainer>
      <View className="flex-1 ">
        {/* Main Content */}
        {currentTab === 'list' ? (
          <StudentListScreen onEdit={handleEdit} refreshKey={refreshKey} />
        ) : (
          <AddStudentScreen 
            student={selectedStudent} 
            onSuccess={handleSuccess} 
            onCancel={handleCancel} 
          />
        )}

        {/* Bottom Tab Bar */}
        <View className="flex-row bg-white border-t border-gray-200 pb-4">
          <TouchableOpacity
            onPress={() => setCurrentTab('list')}
            className={`flex-1 py-3 items-center ${currentTab === 'list' ? 'bg-blue-50' : ''}`}
          >
            <Text className={`text-xl ${currentTab === 'list' ? 'text-blue-600' : 'text-gray-500'}`}>
              📋
            </Text>
            <Text className={`text-sm mt-1 ${currentTab === 'list' ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
              Students Table
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleAddPress}
            className={`flex-1 py-3 items-center ${currentTab === 'add' ? 'bg-blue-50' : ''}`}
          >
            <Text className={`text-xl ${currentTab === 'add' ? 'text-blue-600' : 'text-gray-500'}`}>
              ➕
            </Text>
            <Text className={`text-sm mt-1 ${currentTab === 'add' ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
              Add Student
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </NavigationContainer>
  );
}
