import { Player } from '@/domain/models/Player';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PlayerDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { players } = usePlayerStore();
    const { sessions } = useAnalysisStore();
    const [player, setPlayer] = useState<Player | null>(null);

    useEffect(() => {
        if (typeof id === 'string') {
            const found = players.find(p => p.id === id);
            setPlayer(found || null);
        }
    }, [id, players]);

    const playerSessions = sessions.filter(s => s.playerId === id);

    const handleCall = () => {
        if (player?.phone) {
            Linking.openURL(`tel:${player.phone}`);
        } else {
            Alert.alert('No Phone', 'This player has no phone number listed.');
        }
    };

    const handleEmail = () => {
        if (player?.email) {
            Linking.openURL(`mailto:${player.email}`);
        } else {
            Alert.alert('No Email', 'This player has no email listed.');
        }
    };

    if (!player) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    const getLevelColor = (level: string): readonly [string, string] => {
        switch (level) {
            case 'Advanced': return ['#10b981', '#34d399'] as const;
            case 'Intermediate': return ['#f59e0b', '#fbbf24'] as const;
            default: return ['#3b82f6', '#60a5fa'] as const;
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{player.name.charAt(0)}</Text>
                    </View>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <LinearGradient colors={getLevelColor(player.level || 'Beginner')} style={styles.levelBadge}>
                        <Text style={styles.levelText}>{player.level || 'Beginner'}</Text>
                    </LinearGradient>
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity onPress={handleCall} style={styles.actionBtn}>
                        <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
                            <Ionicons name="call" size={22} color="#16a34a" />
                        </View>
                        <Text style={styles.actionLabel}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleEmail} style={styles.actionBtn}>
                        <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
                            <Ionicons name="mail" size={22} color="#d97706" />
                        </View>
                        <Text style={styles.actionLabel}>Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/analysis/record')} style={styles.actionBtn}>
                        <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
                            <Ionicons name="videocam" size={22} color="#2563eb" />
                        </View>
                        <Text style={styles.actionLabel}>Analyze</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Stats Cards */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={[styles.statIconBg, { backgroundColor: '#ede9fe' }]}>
                            <Ionicons name="time" size={20} color="#7c3aed" />
                        </View>
                        <Text style={styles.statValue}>{playerSessions.length}</Text>
                        <Text style={styles.statLabel}>Sessions</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.statIconBg, { backgroundColor: '#dcfce7' }]}>
                            <Ionicons name="trending-up" size={20} color="#16a34a" />
                        </View>
                        <Text style={styles.statValue}>
                            {playerSessions.length > 0
                                ? (playerSessions.reduce((acc, s) => acc + (s.result?.techniqueScore || 0), 0) / playerSessions.length).toFixed(1)
                                : '-'}
                        </Text>
                        <Text style={styles.statLabel}>Avg Score</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.statIconBg, { backgroundColor: '#fef3c7' }]}>
                            <Ionicons name="calendar" size={20} color="#d97706" />
                        </View>
                        <Text style={styles.statValue}>{Math.floor((Date.now() - player.createdAt) / 86400000)}</Text>
                        <Text style={styles.statLabel}>Days</Text>
                    </View>
                </View>

                {/* Contact Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Ionicons name="call-outline" size={20} color="#6b7280" />
                            <Text style={styles.infoText}>{player.phone || 'Not provided'}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Ionicons name="mail-outline" size={20} color="#6b7280" />
                            <Text style={styles.infoText}>{player.email || 'Not provided'}</Text>
                        </View>
                    </View>
                </View>

                {/* Recent Sessions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Analysis</Text>
                    {playerSessions.length === 0 ? (
                        <View style={styles.emptyCard}>
                            <Ionicons name="videocam-outline" size={32} color="#9ca3af" />
                            <Text style={styles.emptyText}>No analysis sessions yet</Text>
                        </View>
                    ) : (
                        playerSessions.slice(0, 3).map((session) => (
                            <View key={session.id} style={styles.sessionCard}>
                                <View style={styles.sessionHeader}>
                                    <Text style={styles.sessionDate}>{new Date(session.date).toLocaleDateString()}</Text>
                                    <LinearGradient colors={session.status === 'completed' ? ['#10b981', '#34d399'] : ['#f59e0b', '#fbbf24']} style={styles.statusBadge}>
                                        <Text style={styles.statusText}>{session.status}</Text>
                                    </LinearGradient>
                                </View>
                                {session.result && (
                                    <View style={styles.sessionStats}>
                                        <View style={styles.sessionStat}>
                                            <Text style={styles.sessionStatValue}>{session.result.speed}</Text>
                                            <Text style={styles.sessionStatLabel}>km/h</Text>
                                        </View>
                                        <View style={styles.sessionStat}>
                                            <Text style={styles.sessionStatValue}>{session.result.techniqueScore}</Text>
                                            <Text style={styles.sessionStatLabel}>/10</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    profileSection: { alignItems: 'center', marginTop: 20 },
    avatarContainer: { width: 100, height: 100, borderRadius: 30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
    avatarText: { fontSize: 40, fontWeight: 'bold', color: '#6366f1' },
    playerName: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginTop: 16 },
    levelBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 8 },
    levelText: { color: '#fff', fontWeight: '600', fontSize: 13 },
    actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 24 },
    actionBtn: { alignItems: 'center' },
    actionIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
    actionLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '500' },
    content: { flex: 1, padding: 20, marginTop: -20 },
    statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    statCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 20, alignItems: 'center', shadowColor: '#6366f1', shadowOpacity: 0.08, shadowRadius: 20, elevation: 4 },
    statIconBg: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    statValue: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
    statLabel: { color: '#6b7280', fontSize: 12, marginTop: 2 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 12 },
    infoCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
    infoText: { fontSize: 15, color: '#374151' },
    divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 8 },
    emptyCard: { backgroundColor: '#fff', borderRadius: 20, padding: 32, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    emptyText: { color: '#9ca3af', marginTop: 8 },
    sessionCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sessionDate: { fontWeight: '600', color: '#374151' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { color: '#fff', fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
    sessionStats: { flexDirection: 'row', marginTop: 12, gap: 16 },
    sessionStat: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
    sessionStatValue: { fontSize: 20, fontWeight: 'bold', color: '#6366f1' },
    sessionStatLabel: { fontSize: 12, color: '#6b7280' },
});
