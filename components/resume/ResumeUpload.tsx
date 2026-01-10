import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createResume } from '@/services/resumeService';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

interface ResumeUploadProps {
  onUploadSuccess?: () => void;
  multiple?: boolean;
}

export function ResumeUpload({ onUploadSuccess, multiple = false }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const buttonBg = colorScheme === 'dark' ? '#1a3a4a' : '#e6f4fe';

  const validateFile = (file: DocumentPicker.DocumentPickerResult) => {
    if (file.canceled) return null;

    const selectedFile = file.assets[0];
    const fileSizeMB = selectedFile.size! / (1024 * 1024);
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

    // Validate file type
    if (!['pdf', 'docx', 'doc'].includes(fileExtension || '')) {
      Alert.alert('Invalid File', 'Please upload a PDF or DOCX file.');
      return null;
    }

    // Validate file size (max 10MB)
    if (fileSizeMB > 10) {
      Alert.alert('File Too Large', 'File size must be less than 10MB.');
      return null;
    }

    return {
      uri: selectedFile.uri,
      name: selectedFile.name,
      type: fileExtension as 'pdf' | 'docx' | 'doc',
    };
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
        copyToCacheDirectory: true,
        multiple: multiple,
      });

      if (result.canceled) {
        setIsUploading(false);
        return;
      }

      if (multiple && result.assets) {
        // Handle multiple files
        let successCount = 0;
        let failCount = 0;

        for (const asset of result.assets) {
          const file = {
            canceled: false,
            assets: [asset],
          };
          const validated = validateFile(file);
          
          if (validated) {
            try {
              await createResume({
                fileUri: validated.uri,
                fileName: validated.name,
                fileType: validated.type,
              });
              successCount++;
            } catch (error) {
              console.error('Upload error:', error);
              failCount++;
            }
          } else {
            failCount++;
          }
        }

        Alert.alert(
          'Upload Complete',
          `Successfully uploaded ${successCount} file(s). ${failCount > 0 ? `${failCount} file(s) failed.` : ''}`
        );
      } else {
        // Handle single file
        const validated = validateFile(result);
        if (!validated) {
          setIsUploading(false);
          return;
        }

        await createResume({
          fileUri: validated.uri,
          fileName: validated.name,
          fileType: validated.type,
        });

        // Show success message for candidates
        if (user?.role === 'candidate' && !multiple) {
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 3000);
        } else {
          Alert.alert('Success', 'Resume uploaded successfully!');
        }
      }

      onUploadSuccess?.();
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {showSuccessMessage && (
        <View style={[styles.successMessage, { backgroundColor: '#32cd3220', borderColor: '#32cd32' }]}>
          <ThemedText style={[styles.successText, { color: '#32cd32' }]}>
            ✓ Resume uploaded...
          </ThemedText>
        </View>
      )}
      <TouchableOpacity
        style={[styles.uploadButton, { backgroundColor: buttonBg, borderColor }]}
        onPress={handleUpload}
        disabled={isUploading}>
        {isUploading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#0a7ea4" />
            <ThemedText style={[styles.buttonText, { color: textColor, marginLeft: 8 }]}>
              Uploading...
            </ThemedText>
          </View>
        ) : (
          <ThemedText style={[styles.buttonText, { color: textColor }]}>
            {multiple ? '📁 Upload Multiple Resumes' : '📄 Upload Resume'}
          </ThemedText>
        )}
      </TouchableOpacity>
      <ThemedText style={[styles.hint, { color: borderColor }]}>
        Supported formats: PDF, DOCX (Max 10MB)
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  uploadButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  successMessage: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  successText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

