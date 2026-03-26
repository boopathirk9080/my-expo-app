import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { supabase, Student } from '../lib/supabase';

interface StudentListProps {
  onEdit: (student: Student) => void;
  refreshKey: number;
}

export default function StudentList({ onEdit, refreshKey }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, refreshKey]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents();
  };

  const handleDelete = (student: Student) => {
    Alert.alert(
      'Delete Student',
      `Are you sure you want to delete ${student.first_name} ${student.last_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('students')
                .delete()
                .eq('id', student.id);

              if (error) throw error;
              setStudents(students.filter((s) => s.id !== student.id));
              Alert.alert('Success', 'Student deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete student');
            }
          },
        },
      ]
    );
  };

  const renderStudentCard = ({ item }: { item: Student }) => (
    <View className="bg-white rounded-lg shadow-md mb-3 p-4 flex-row">
      {/* Photo */}
      <View className="mr-4">
        {item.photo_url ? (
          <Image
            source={{ uri: item.photo_url }}
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center">
            <Text className="text-2xl">👤</Text>
          </View>
        )}
      </View>

      {/* Student Info */}
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">
          {item.first_name} {item.last_name}
        </Text>
        <Text className="text-sm text-gray-600">
          {item.department} {item.age ? `| Age: ${item.age}` : ''}
        </Text>
        {item.email && (
          <Text className="text-xs text-gray-500">{item.email}</Text>
        )}
        {(item.district || item.pincode) && (
          <Text className="text-xs text-gray-500">
            {item.district} {item.pincode ? `- ${item.pincode}` : ''}
          </Text>
        )}
      </View>

      {/* Actions */}
      <View className="justify-center">
        <TouchableOpacity
          onPress={() => onEdit(item)}
          className="bg-blue-500 px-4 py-2 rounded mb-2"
        >
          <Text className="text-white text-sm">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item)}
          className="bg-red-500 px-4 py-2 rounded"
        >
          <Text className="text-white text-sm">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-500">Loading students...</Text>
      </View>
    );
  }

  if (students.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="text-4xl mb-4">📚</Text>
        <Text className="text-gray-600 text-lg">No students found</Text>
        <Text className="text-gray-500">Add your first student from the Add Student tab</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Table Header */}
      <View className="bg-blue-600 rounded-t-lg p-3 flex-row mb-2">
        <Text className="text-white font-semibold flex-1">Student List</Text>
        <Text className="text-white font-semibold">Total: {students.length}</Text>
      </View>

      <FlatList
        data={students}
        renderItem={renderStudentCard}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
