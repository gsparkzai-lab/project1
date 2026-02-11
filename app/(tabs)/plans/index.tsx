import { theme } from '@/constants/theme';
import { generatePlan, TrainingPlan } from '@/services/training/PlanGenerator';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const initialPlans: TrainingPlan[] = [
    {
        id: 'plan-1',
        playerId: '1',
        playerName: 'Serena Williams',
        generatedAt: Date.now() - 86400000 * 1,
        focusArea: 'Power',
        drills: ['High-intensity interval feeding (20 mins)', 'Match play simulation (30 mins)', 'Target serving under pressure (20 mins)'],
    },
    {
        id: 'plan-2',
        playerId: '2',
        playerName: 'Rafael Nadal',
        generatedAt: Date.now() - 86400000 * 2,
        focusArea: 'Stamina',
        drills: ['Court sprints with ball pickup (15 mins)', 'Extended rally practice (25 mins)', 'Shadow footwork drills (15 mins)'],
    },
    {
        id: 'plan-3',
        playerId: '3',
        playerName: 'Emma Raducanu',
        generatedAt: Date.now() - 86400000 * 3,
        focusArea: 'Technique',
        drills: ['Wall volley (10 mins)', 'Forehand toss feed (15 mins)', 'Mini tennis for touch (10 mins)'],
    },
    {
        id: 'plan-4',
        playerId: '4',
        playerName: 'Carlos Alcaraz',
        generatedAt: Date.now() - 86400000 * 4,
        focusArea: 'Speed',
        drills: ['Ladder agility drills (12 mins)', 'Reaction ball training (10 mins)', 'Net rush recovery drills (15 mins)'],
    },
];

export default function PlansScreen() {
    const { players } = usePlayerStore();
    const [plans, setPlans] = useState<TrainingPlan[]>(initialPlans);
    const [loading, setLoading] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

    const handleGenerate = () => {
        if (!selectedPlayerId) return;
        const player = players.find(p => p.id === selectedPlayerId);
        if (!player) return;

        setLoading(true);
        setTimeout(() => {
            const newPlan = generatePlan(player.name, player.level || 'Beginner');
            newPlan.playerId = player.id;
            setPlans([newPlan, ...plans]);
            setLoading(false);
            setSelectedPlayerId(null);
        }, 1500);
    };

    const getFocusColor = (focus: string) => {
        switch (focus) {
            case 'Power': return { bg: ['#fff7ed', '#ffedd5'], text: theme.secondary.orange, border: theme.secondary.orange, icon: 'flash' };
            case 'Speed': return { bg: ['#eff6ff', '#dbeafe'], text: theme.secondary.blue, border: theme.secondary.blue, icon: 'speedometer' };
            case 'Stamina': return { bg: ['#fff1f2', '#ffe4e6'], text: theme.secondary.pink, border: theme.secondary.pink, icon: 'heart' };
            default: return { bg: ['#ecfdf5', '#d1fae5'], text: theme.functional.success, border: theme.functional.success, icon: 'tennisball' };
        }
    };

    return (
        <LinearGradient colors={['#f8fafc', '#f1f5f9', '#e2e8f0']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <LinearGradient colors={theme.gradients.royal} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={styles.greeting}>CoachKeith</Text>
                <Text style={styles.title}>Training Plans</Text>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <LinearGradient colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']} style={styles.statGradient}>
                            <Text style={styles.statNumber}>{plans.length}</Text>
                            <Text style={styles.statLabel}>Active</Text>
                        </LinearGradient>
                    </View>
                    <View style={styles.statCard}>
                        <LinearGradient colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']} style={styles.statGradient}>
                            <Text style={styles.statNumber}>{new Set(plans.map(p => p.playerId)).size}</Text>
                            <Text style={styles.statLabel}>Athletes</Text>
                        </LinearGradient>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                {/* Player Selection */}
                <View style={[styles.generateSection, theme.shadows.md]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="options" size={18} color={theme.neutral.gray400} />
                        <Text style={styles.sectionTitle}>GENERATE NEW PLAN</Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.playerScroll}>
                        {players.map((player) => (
                            <TouchableOpacity
                                key={player.id}
                                onPress={() => setSelectedPlayerId(selectedPlayerId === player.id ? null : player.id)}
                                activeOpacity={0.7}
                                style={[
                                    styles.playerChip,
                                    selectedPlayerId === player.id && styles.playerChipSelected,
                                    selectedPlayerId === player.id && { borderColor: theme.primary.solid }
                                ]}
                            >
                                {player.imageUrl ? (
                                    <Image source={{ uri: player.imageUrl }} style={styles.playerImage} />
                                ) : (
                                    <LinearGradient
                                        colors={selectedPlayerId === player.id ? theme.gradients.primary : ['#e2e8f0', '#cbd5e1']}
                                        style={styles.playerAvatar}
                                    >
                                        <Text style={[styles.playerAvatarText, selectedPlayerId === player.id && { color: '#fff' }]}>
                                            {player.name.charAt(0)}
                                        </Text>
                                    </LinearGradient>
                                )}
                                <Text style={[styles.playerChipName, selectedPlayerId === player.id && { color: theme.primary.solid }]}>
                                    {player.name.split(' ')[0]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        onPress={handleGenerate}
                        disabled={!selectedPlayerId || loading}
                        activeOpacity={0.8}
                        style={{ marginTop: 8 }}
                    >
                        <LinearGradient
                            colors={selectedPlayerId && !loading ? theme.gradients.secondary : ['#e2e8f0', '#cbd5e1']}
                            style={styles.generateButton}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Ionicons name="sparkles" size={20} color="#fff" />
                            )}
                            <Text style={styles.generateButtonText}>
                                {loading ? 'Creating Plan...' : 'Generate AI Plan'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Plans List */}
                <Text style={styles.listTitle}>Recent Plans</Text>

                {plans.map((plan, index) => {
                    const player = players.find(p => p.id === plan.playerId);
                    const focusStyle = getFocusColor(plan.focusArea);

                    return (
                        <View key={plan.id} style={[styles.planCard, theme.shadows.md]}>
                            <LinearGradient
                                colors={focusStyle.bg as any}
                                style={styles.planGradient}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.planHeader}>
                                    <View style={[styles.focusBadge, { backgroundColor: '#fff', shadowColor: focusStyle.text, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }]}>
                                        <Ionicons name={focusStyle.icon as any} size={16} color={focusStyle.text} />
                                        <Text style={[styles.focusText, { color: focusStyle.text }]}>{plan.focusArea}</Text>
                                    </View>
                                    <Text style={[styles.planDate, { color: focusStyle.text, opacity: 0.8 }]}>{new Date(plan.generatedAt).toLocaleDateString()}</Text>
                                </View>

                                <View style={styles.playerRow}>
                                    {player?.imageUrl ? (
                                        <Image source={{ uri: player.imageUrl }} style={styles.smallPlayerImage} />
                                    ) : (
                                        <LinearGradient colors={theme.gradients.primary} style={styles.smallAvatar}>
                                            <Text style={styles.smallAvatarText}>{plan.playerName.charAt(0)}</Text>
                                        </LinearGradient>
                                    )}
                                    <View>
                                        <Text style={styles.planPlayerName}>{plan.playerName}</Text>
                                        <Text style={styles.planLevel}>{player?.level || 'Athlete'}</Text>
                                    </View>
                                </View>

                                <View style={styles.drillsContainer}>
                                    {plan.drills.map((drill, i) => (
                                        <View key={i} style={[styles.drillRow, { backgroundColor: 'rgba(255,255,255,0.6)', padding: 8, borderRadius: 12 }]}>
                                            <LinearGradient colors={theme.gradients.primary} style={styles.drillNumber}>
                                                <Text style={styles.drillNumberText}>{i + 1}</Text>
                                            </LinearGradient>
                                            <Text style={styles.drillText}>{drill}</Text>
                                        </View>
                                    ))}
                                </View>

                                <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
                                    <LinearGradient colors={theme.gradients.success} style={styles.startButtonGradient}>
                                        <Ionicons name="play" size={16} color="#fff" />
                                        <Text style={styles.startButtonText}>Start Workout</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    );
                })}
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
    greeting: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '600', marginBottom: 2 },
    title: { fontSize: 28, fontWeight: '800', color: '#fff' },
    statsRow: { flexDirection: 'row', marginTop: 20, gap: 12 },
    statCard: { flex: 1, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    statGradient: { padding: 14, alignItems: 'center' },
    statNumber: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    statLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 11, textTransform: 'uppercase', fontWeight: 'bold' },

    content: { flex: 1 },
    contentContainer: { padding: 20, paddingBottom: 100 },

    generateSection: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#fff',
        shadowColor: '#6366f1',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    sectionTitle: { fontSize: 11, fontWeight: '800', color: theme.neutral.gray400, letterSpacing: 1 },
    playerScroll: { marginBottom: 16 },
    playerChip: {
        alignItems: 'center',
        marginRight: 16,
        padding: 4,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    playerChipSelected: { backgroundColor: '#f8fafc' },
    playerAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
    playerImage: { width: 48, height: 48, borderRadius: 24, marginBottom: 6 },
    playerAvatarText: { fontWeight: 'bold', color: theme.neutral.gray500, fontSize: 16 },
    playerChipName: { fontSize: 12, color: theme.neutral.gray600, fontWeight: '600' },

    generateButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16 },
    generateButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

    listTitle: { fontSize: 18, fontWeight: '700', color: theme.neutral.gray800, marginBottom: 16 },

    planCard: {
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    planGradient: { padding: 20 },
    planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    focusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
    focusText: { fontWeight: '700', fontSize: 12, textTransform: 'uppercase' },
    planDate: { fontSize: 12, fontWeight: '600' },

    playerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
    smallAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
    smallPlayerImage: { width: 42, height: 42, borderRadius: 21 },
    smallAvatarText: { fontWeight: 'bold', color: '#fff', fontSize: 16 },
    planPlayerName: { fontWeight: 'bold', fontSize: 16, color: theme.neutral.gray900 },
    planLevel: { color: theme.neutral.gray600, fontSize: 12 },

    drillsContainer: { marginBottom: 16 },
    drillRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    drillNumber: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    drillNumberText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    drillText: { flex: 1, fontSize: 14, color: theme.neutral.gray800, lineHeight: 20, fontWeight: '500' },

    startButton: { alignSelf: 'flex-start' },
    startButtonGradient: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
    startButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});
