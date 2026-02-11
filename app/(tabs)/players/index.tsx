import { theme } from '@/constants/theme';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PlayersScreen() {
    const { players, fetchPlayers, isLoading } = usePlayerStore();

    useEffect(() => {
        fetchPlayers();
    }, []);

    const getLevelBadgeColors = (level: string) => {
        switch (level) {
            case 'Advanced': return { bg: '#fce7f3', text: '#db2777', border: '#f472b6' }; // Pink
            case 'Intermediate': return { bg: '#e0f2fe', text: '#0284c7', border: '#38bdf8' }; // Sky
            default: return { bg: '#dcfce7', text: '#16a34a', border: '#4ade80' }; // Green
        }
    };

    const getCardGradient = (index: number) => {
        // Vibrant pastel gradients for cards
        const gradients = [
            ['#ffffff', '#eef2ff'], // White to Soft Indigo
            ['#ffffff', '#fdf2f8'], // White to Soft Pink
            ['#ffffff', '#ecfdf5'], // White to Soft Emerald
            ['#ffffff', '#fff7ed'], // White to Soft Orange
            ['#ffffff', '#f0f9ff'], // White to Soft Sky
        ];
        return gradients[index % gradients.length];
    };

    return (
        <LinearGradient colors={['#f3f4f6', '#e0e7ff', '#f3e8ff']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            {/* Rich Gradient Header */}
            <LinearGradient colors={theme.gradients.primary} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.greeting}>Welcome CoachKeith 👋</Text>
                        <Text style={styles.title}>Tennis Coach Keith</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/players/create')}
                        style={styles.addButton}
                        activeOpacity={0.8}
                    >
                        <LinearGradient colors={theme.gradients.secondary} style={styles.addButtonGradient}>
                            <Ionicons name="add" size={24} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Highlight Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']} style={styles.statGradient}>
                            <Text style={styles.statNumber}>{players.length}</Text>
                            <Text style={styles.statLabel}>Total</Text>
                        </LinearGradient>
                    </View>
                    <View style={styles.statCard}>
                        <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']} style={styles.statGradient}>
                            <Text style={styles.statNumber}>{players.filter(p => p.level === 'Advanced').length}</Text>
                            <Text style={styles.statLabel}>Pro</Text>
                        </LinearGradient>
                    </View>
                    <View style={styles.statCard}>
                        <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']} style={styles.statGradient}>
                            <Text style={styles.statNumber}>{players.filter(p => p.level === 'Beginner').length}</Text>
                            <Text style={styles.statLabel}>Rookie</Text>
                        </LinearGradient>
                    </View>
                </View>
            </LinearGradient>

            {/* Main Content */}
            {isLoading && players.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary.solid} />
                </View>
            ) : (
                <FlatList
                    data={players}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        const levelStyle = getLevelBadgeColors(item.level || 'Beginner');
                        return (
                            <TouchableOpacity
                                onPress={() => router.push(`/(tabs)/players/${item.id}`)}
                                activeOpacity={0.9}
                                style={[styles.playerCardContainer, theme.shadows.md]}
                            >
                                <LinearGradient
                                    colors={getCardGradient(index) as any}
                                    style={styles.playerCard}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                                >
                                    <View style={styles.cardInner}>
                                        <View style={styles.imageContainer}>
                                            {item.imageUrl ? (
                                                <Image source={{ uri: item.imageUrl }} style={styles.playerImage} />
                                            ) : (
                                                <LinearGradient
                                                    colors={theme.gradients.royal}
                                                    style={styles.avatar}
                                                >
                                                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                                                </LinearGradient>
                                            )}
                                            {/* Online/Status Indicator */}
                                            <View style={[styles.statusIndicator, { backgroundColor: '#22c55e' }]} />
                                        </View>

                                        <View style={styles.playerInfo}>
                                            <View style={styles.nameRow}>
                                                <Text style={styles.playerName}>{item.name}</Text>
                                                {item.level === 'Advanced' && <Ionicons name="star" size={12} color="#f59e0b" />}
                                            </View>
                                            <Text style={styles.playerEmail}>{item.email || 'No email'}</Text>

                                            <View style={[styles.levelBadge, { backgroundColor: levelStyle.bg, borderColor: levelStyle.border }]}>
                                                <Text style={[styles.levelText, { color: levelStyle.text }]}>{item.level || 'Beginner'}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.actionContainer}>
                                            <LinearGradient colors={['#f3f4f6', '#e5e7eb']} style={styles.iconCircle}>
                                                <Ionicons name="chevron-forward" size={20} color={theme.neutral.gray500} />
                                            </LinearGradient>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIcon}>
                                <Ionicons name="people" size={48} color={theme.neutral.gray400} />
                            </View>
                            <Text style={styles.emptyTitle}>No players yet</Text>
                            <Text style={styles.emptySubtitle}>Add your first player to get started</Text>
                            <TouchableOpacity
                                onPress={() => router.push('/(tabs)/players/create')}
                                style={styles.emptyButton}
                            >
                                <LinearGradient colors={theme.gradients.primary} style={styles.emptyButtonGradient}>
                                    <Text style={styles.emptyButtonText}>Add Player</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 16,
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greeting: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
    },
    addButton: {
        borderRadius: 14,
        ...theme.shadows.glow,
    },
    addButtonGradient: {
        padding: 12,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12
    },
    statCard: {
        flex: 1,
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    statGradient: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 11,
        fontWeight: '700',
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    playerCardContainer: {
        marginBottom: 16,
        borderRadius: 24,
        shadowColor: '#6366f1',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    playerCard: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ffffff',
    },
    cardInner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    imageContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        height: 60,
        width: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    playerImage: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#fff',
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff'
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#fff',
    },
    playerInfo: {
        flex: 1
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    playerName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1e293b',
    },
    playerEmail: {
        color: '#64748b',
        fontSize: 13,
        marginBottom: 10,
    },
    levelBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
    },
    levelText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    actionContainer: {
        padding: 8
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
        padding: 32
    },
    emptyIcon: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(255,255,255,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#334155',
    },
    emptySubtitle: {
        color: '#64748b',
        marginTop: 8,
        textAlign: 'center',
    },
    emptyButton: {
        marginTop: 24,
        borderRadius: 14,
        ...theme.shadows.lg,
    },
    emptyButtonGradient: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 14,
    },
    emptyButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});
