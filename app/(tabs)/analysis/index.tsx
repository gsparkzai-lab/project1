import { theme } from '@/constants/theme';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AnalysisScreen() {
    const { sessions, isAnalyzing } = useAnalysisStore();
    const { players } = usePlayerStore();

    const getPlayerName = (playerId: string) => players.find(p => p.id === playerId)?.name || 'Unknown Player';
    const getPlayerImage = (playerId: string) => players.find(p => p.id === playerId)?.imageUrl;
    const getPlayerInitial = (playerId: string) => players.find(p => p.id === playerId)?.name.charAt(0) || '?';

    return (
        <LinearGradient colors={['#f0fdf4', '#e0f2fe', '#f0f9ff']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <LinearGradient colors={theme.gradients.secondary} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.greeting}>CoachKeith</Text>
                        <Text style={styles.title}>Analysis Hub</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/analysis/record')}
                        style={styles.newButton}
                        activeOpacity={0.8}
                    >
                        <LinearGradient colors={theme.gradients.primary} style={styles.newButtonGradient}>
                            <Ionicons name="videocam" size={22} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']} style={styles.statGradient}>
                            <Ionicons name="film" size={20} color="#fff" />
                            <Text style={styles.statNumber}>{sessions.length}</Text>
                            <Text style={styles.statLabel}>Total</Text>
                        </LinearGradient>
                    </View>
                    <View style={styles.statCard}>
                        <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']} style={styles.statGradient}>
                            <Ionicons name="checkmark-done-circle" size={20} color="#fff" />
                            <Text style={styles.statNumber}>{sessions.filter(s => s.status === 'completed').length}</Text>
                            <Text style={styles.statLabel}>Done</Text>
                        </LinearGradient>
                    </View>
                    <View style={styles.statCard}>
                        <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']} style={styles.statGradient}>
                            <Ionicons name="trophy" size={20} color="#fff" />
                            <Text style={styles.statNumber}>
                                {sessions.filter(s => s.result).length > 0
                                    ? (sessions.reduce((acc, s) => acc + (s.result?.techniqueScore || 0), 0) / sessions.filter(s => s.result).length).toFixed(1)
                                    : '-'}
                            </Text>
                            <Text style={styles.statLabel}>Avg Score</Text>
                        </LinearGradient>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                {isAnalyzing && (
                    <LinearGradient colors={theme.gradients.secondary} style={styles.processingCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                        <View style={styles.processingIcon}>
                            <ActivityIndicator size="small" color={theme.primary.solid} />
                        </View>
                        <View style={styles.processingText}>
                            <Text style={styles.processingTitle}>Analyzing Video...</Text>
                            <Text style={styles.processingSubtitle}>AI is crunching the numbers</Text>
                        </View>
                    </LinearGradient>
                )}

                {sessions.map((session) => {
                    const playerImage = getPlayerImage(session.playerId);
                    const isCompleted = session.status === 'completed';

                    return (
                        <View key={session.id} style={[styles.sessionCard, theme.shadows.md]}>
                            {/* Video Preview */}
                            <View style={styles.thumbnailContainer}>
                                {session.thumbnailUrl && (
                                    <Image source={{ uri: session.thumbnailUrl }} style={styles.videoThumbnail} />
                                )}
                                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.thumbnailOverlay}>
                                    <View style={styles.overlayContent}>
                                        <View style={[styles.typeBadge, { backgroundColor: theme.primary.solid }]}>
                                            <Text style={styles.typeText}>{session.videoType || 'Training'}</Text>
                                        </View>
                                        <Text style={styles.dateText}>{new Date(session.date).toLocaleDateString()}</Text>
                                    </View>
                                </LinearGradient>
                            </View>

                            <LinearGradient
                                colors={['#ffffff', '#f8fafc']}
                                style={styles.sessionContent}
                            >
                                <View style={styles.sessionHeader}>
                                    <View style={styles.playerInfo}>
                                        {playerImage ? (
                                            <Image source={{ uri: playerImage }} style={styles.playerAvatar} />
                                        ) : (
                                            <LinearGradient colors={theme.gradients.royal} style={styles.playerAvatarGradient}>
                                                <Text style={styles.playerAvatarText}>{getPlayerInitial(session.playerId)}</Text>
                                            </LinearGradient>
                                        )}
                                        <View>
                                            <Text style={styles.playerName}>{getPlayerName(session.playerId)}</Text>
                                            <Text style={styles.playerIdLabel}>Player</Text>
                                        </View>
                                    </View>

                                    <View style={[styles.statusBadge,
                                    isCompleted ? { backgroundColor: '#dcfce7' } : { backgroundColor: '#fef3c7' } // Brighter status bg
                                    ]}>
                                        <Text style={[styles.statusText,
                                        isCompleted ? { color: '#166534' } : { color: '#b45309' }
                                        ]}>
                                            {session.status}
                                        </Text>
                                    </View>
                                </View>

                                {session.result && (
                                    <>
                                        <View style={styles.metricsRow}>
                                            <LinearGradient colors={['#fff0f7', '#fce7f3']} style={styles.metricCard}>
                                                <Ionicons name="flash" size={20} color={theme.secondary.pink} />
                                                <Text style={[styles.metricValue, { color: theme.secondary.pink }]}>{session.result.speed}</Text>
                                                <Text style={styles.metricLabel}>KM/H</Text>
                                            </LinearGradient>
                                            <LinearGradient colors={['#ecfdf5', '#d1fae5']} style={styles.metricCard}>
                                                <Ionicons name="leaf" size={20} color={theme.functional.success} />
                                                <Text style={[styles.metricValue, { color: theme.functional.success }]}>{session.result.techniqueScore}</Text>
                                                <Text style={styles.metricLabel}>SCORE</Text>
                                            </LinearGradient>
                                            <LinearGradient colors={['#f0f9ff', '#e0f2fe']} style={styles.metricCard}>
                                                <Ionicons name="analytics" size={20} color={theme.functional.info} />
                                                <Text style={[styles.metricValue, { color: theme.functional.info }]}>Top</Text>
                                                <Text style={styles.metricLabel}>TIER</Text>
                                            </LinearGradient>
                                        </View>

                                        <View style={styles.feedbackSection}>
                                            <View style={styles.feedbackHeader}>
                                                <Ionicons name="bulb" size={18} color={theme.secondary.orange} />
                                                <Text style={styles.feedbackTitle}>AI COACH INSIGHTS</Text>
                                            </View>
                                            {session.result.feedback.slice(0, 2).map((f, i) => (
                                                <View key={i} style={styles.feedbackRow}>
                                                    <View style={styles.feedbackBullet} />
                                                    <Text style={styles.feedbackText}>{f}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </>
                                )}
                            </LinearGradient>
                        </View>
                    );
                })}

                {sessions.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="videocam-outline" size={64} color={theme.neutral.gray400} />
                        <Text style={styles.emptyTitle}>No Analysis Yet</Text>
                        <Text style={styles.emptySubtitle}>Upload a video to see AI insights</Text>
                    </View>
                )}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 16,
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    greeting: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600' },
    title: { fontSize: 32, fontWeight: '800', color: '#fff' },
    newButton: { borderRadius: 14, ...theme.shadows.glow },
    newButtonGradient: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    statsRow: { flexDirection: 'row', gap: 12 },
    statCard: { flex: 1, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    statGradient: { padding: 12, alignItems: 'center' },
    statNumber: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 4 },
    statLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
    content: { flex: 1 },
    contentContainer: { padding: 20, paddingBottom: 100 },
    processingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        gap: 16,
    },
    processingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.sm
    },
    processingText: { flex: 1 },
    processingTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    processingSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },

    sessionCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        marginBottom: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#fff',
        shadowColor: '#0ea5e9',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    thumbnailContainer: { height: 180, position: 'relative' },
    videoThumbnail: { width: '100%', height: '100%' },
    thumbnailOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        justifyContent: 'flex-end',
        padding: 16
    },
    overlayContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    typeText: { color: '#fff', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
    dateText: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '600' },

    sessionContent: { padding: 16 },
    sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    playerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    playerAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: theme.neutral.gray100 },
    playerAvatarGradient: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    playerAvatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    playerName: { fontWeight: 'bold', fontSize: 16, color: theme.neutral.gray900 },
    playerIdLabel: { color: theme.neutral.gray500, fontSize: 12 },

    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },

    metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    metricCard: { flex: 1, padding: 12, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)' },
    metricValue: { fontSize: 20, fontWeight: '800', marginVertical: 4 },
    metricLabel: { fontSize: 10, color: theme.neutral.gray500, fontWeight: '700' },

    feedbackSection: {
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 16,
        borderLeftWidth: 4,
        borderLeftColor: theme.secondary.orange,
    },
    feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    feedbackTitle: { fontSize: 11, fontWeight: '800', color: theme.secondary.orange, letterSpacing: 0.5 },
    feedbackRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 10 },
    feedbackBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.neutral.gray400, marginTop: 7 },
    feedbackText: { flex: 1, fontSize: 13, color: theme.neutral.gray700, lineHeight: 18 },

    emptyState: { alignItems: 'center', marginTop: 40, opacity: 0.6 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', color: theme.neutral.gray800, marginTop: 16 },
    emptySubtitle: { color: theme.neutral.gray500, marginTop: 4 },
});
