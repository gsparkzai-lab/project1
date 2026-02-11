import { useAnalysisStore } from '@/store/useAnalysisStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RecordScreen() {
    const { startAnalysis } = useAnalysisStore();
    const { players } = usePlayerStore();
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

    const pickVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedVideo(result.assets[0].uri);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedPlayerId) {
            Alert.alert('Select Player', 'Please select a player for this analysis.');
            return;
        }

        const videoUri = selectedVideo || 'https://sample-videos.com/tennis-serve.mp4';

        try {
            await startAnalysis(selectedPlayerId, videoUri);
            Alert.alert('Analysis Started', 'AI is processing your video.');
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to start analysis');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>New Analysis</Text>
                    <View style={{ width: 44 }} />
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Player Selection */}
                <Text style={styles.sectionTitle}>Select Player</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.playerScroll}>
                    {players.map((player) => (
                        <TouchableOpacity
                            key={player.id}
                            onPress={() => setSelectedPlayerId(player.id)}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                colors={selectedPlayerId === player.id ? ['#6366f1', '#8b5cf6'] : ['#fff', '#fff']}
                                style={styles.playerChip}
                            >
                                <LinearGradient
                                    colors={selectedPlayerId === player.id ? ['#fff', '#fff'] : ['#6366f1', '#8b5cf6']}
                                    style={styles.playerAvatar}
                                >
                                    <Text style={[styles.playerAvatarText, selectedPlayerId === player.id && { color: '#6366f1' }]}>
                                        {player.name.charAt(0)}
                                    </Text>
                                </LinearGradient>
                                <Text style={[styles.playerChipText, selectedPlayerId === player.id && { color: '#fff' }]}>
                                    {player.name.split(' ')[0]}
                                </Text>
                                {selectedPlayerId === player.id && (
                                    <View style={styles.checkBadge}>
                                        <Ionicons name="checkmark" size={12} color="#fff" />
                                    </View>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Video Selection */}
                <Text style={styles.sectionTitle}>Upload Video</Text>
                {selectedVideo ? (
                    <LinearGradient colors={['#1f2937', '#374151']} style={styles.videoPreview}>
                        <Ionicons name="play-circle" size={64} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.videoPreviewText}>Video Ready</Text>
                        <TouchableOpacity onPress={() => setSelectedVideo(null)} style={styles.changeVideoBtn}>
                            <Text style={styles.changeVideoText}>Change Video</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                ) : (
                    <TouchableOpacity onPress={pickVideo} activeOpacity={0.8}>
                        <View style={styles.uploadArea}>
                            <View style={styles.uploadIconBg}>
                                <Ionicons name="cloud-upload" size={32} color="#6366f1" />
                            </View>
                            <Text style={styles.uploadText}>Tap to Select Video</Text>
                            <Text style={styles.uploadSubtext}>or use a sample video below</Text>
                        </View>
                    </TouchableOpacity>
                )}

                {/* Sample Videos */}
                <Text style={styles.sectionTitle}>Sample Videos</Text>
                <View style={styles.sampleVideos}>
                    <TouchableOpacity
                        onPress={() => setSelectedVideo('sample://serve.mp4')}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={selectedVideo === 'sample://serve.mp4' ? ['#6366f1', '#8b5cf6'] : ['#f3f4f6', '#e5e7eb']}
                            style={styles.sampleCard}
                        >
                            <Ionicons name="tennisball" size={28} color={selectedVideo === 'sample://serve.mp4' ? '#fff' : '#6366f1'} />
                            <Text style={[styles.sampleText, selectedVideo === 'sample://serve.mp4' && { color: '#fff' }]}>Serve</Text>
                            <Text style={[styles.sampleSubtext, selectedVideo === 'sample://serve.mp4' && { color: 'rgba(255,255,255,0.7)' }]}>Pro technique</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSelectedVideo('sample://backhand.mp4')}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={selectedVideo === 'sample://backhand.mp4' ? ['#6366f1', '#8b5cf6'] : ['#f3f4f6', '#e5e7eb']}
                            style={styles.sampleCard}
                        >
                            <Ionicons name="tennisball" size={28} color={selectedVideo === 'sample://backhand.mp4' ? '#fff' : '#10b981'} />
                            <Text style={[styles.sampleText, selectedVideo === 'sample://backhand.mp4' && { color: '#fff' }]}>Backhand</Text>
                            <Text style={[styles.sampleSubtext, selectedVideo === 'sample://backhand.mp4' && { color: 'rgba(255,255,255,0.7)' }]}>Two-handed</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSelectedVideo('sample://forehand.mp4')}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={selectedVideo === 'sample://forehand.mp4' ? ['#6366f1', '#8b5cf6'] : ['#f3f4f6', '#e5e7eb']}
                            style={styles.sampleCard}
                        >
                            <Ionicons name="tennisball" size={28} color={selectedVideo === 'sample://forehand.mp4' ? '#fff' : '#f59e0b'} />
                            <Text style={[styles.sampleText, selectedVideo === 'sample://forehand.mp4' && { color: '#fff' }]}>Forehand</Text>
                            <Text style={[styles.sampleSubtext, selectedVideo === 'sample://forehand.mp4' && { color: 'rgba(255,255,255,0.7)' }]}>Power shot</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Footer Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={handleAnalyze}
                    disabled={!selectedPlayerId}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={selectedPlayerId ? ['#6366f1', '#8b5cf6'] : ['#d1d5db', '#9ca3af']}
                        style={styles.analyzeButton}
                    >
                        <Ionicons name="sparkles" size={24} color="#fff" />
                        <Text style={styles.analyzeButtonText}>Start AI Analysis</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    header: { paddingTop: 20, paddingBottom: 24, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    content: { flex: 1, padding: 20 },
    sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#1f2937', marginBottom: 14, marginTop: 8 },
    playerScroll: { marginBottom: 8 },
    playerChip: { alignItems: 'center', marginRight: 12, padding: 14, borderRadius: 20, minWidth: 90, shadowColor: '#6366f1', shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
    playerAvatar: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    playerAvatarText: { fontWeight: 'bold', color: '#fff', fontSize: 20 },
    playerChipText: { fontSize: 13, color: '#374151', fontWeight: '600' },
    checkBadge: { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 10, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
    videoPreview: { width: '100%', height: 200, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    videoPreviewText: { color: '#fff', marginTop: 12, fontWeight: '600' },
    changeVideoBtn: { marginTop: 12, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
    changeVideoText: { color: '#fff', fontSize: 13 },
    uploadArea: { width: '100%', height: 180, backgroundColor: '#fff', borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', borderColor: '#d1d5db', justifyContent: 'center', alignItems: 'center', marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    uploadIconBg: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#ede9fe', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    uploadText: { color: '#374151', fontWeight: '600', fontSize: 16 },
    uploadSubtext: { color: '#9ca3af', fontSize: 13, marginTop: 4 },
    sampleVideos: { flexDirection: 'row', gap: 12 },
    sampleCard: { flex: 1, padding: 20, borderRadius: 20, alignItems: 'center', minWidth: 100 },
    sampleText: { marginTop: 10, fontWeight: '700', color: '#374151', fontSize: 15 },
    sampleSubtext: { color: '#6b7280', fontSize: 12, marginTop: 2 },
    footer: { padding: 20, paddingBottom: 36, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb' },
    analyzeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18, borderRadius: 20, shadowColor: '#6366f1', shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },
    analyzeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});
