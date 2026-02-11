import { usePlayerStore } from '@/store/usePlayerStore';
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreatePlayerScreen() {
    const { addPlayer } = usePlayerStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [level, setLevel] = useState('Beginner');

    const handleSave = async () => {
        if (!name) {
            Alert.alert('Error', 'Name is required');
            return;
        }

        try {
            await addPlayer({
                id: Crypto.randomUUID(),
                name,
                email,
                phone,
                level: level as any,
                createdAt: Date.now(),
            });
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to save player');
        }
    };

    const levels = [
        { value: 'Beginner', icon: 'leaf', color: '#3b82f6' },
        { value: 'Intermediate', icon: 'flash', color: '#f59e0b' },
        { value: 'Advanced', icon: 'trophy', color: '#10b981' },
    ];

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>New Player</Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                <View style={styles.avatarSection}>
                    <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.avatarLarge}>
                        <Text style={styles.avatarText}>{name ? name.charAt(0).toUpperCase() : '?'}</Text>
                    </LinearGradient>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="person-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter player's name"
                            placeholderTextColor="#9ca3af"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="mail-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="player@email.com"
                            placeholderTextColor="#9ca3af"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="call-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="+1 234 567 8900"
                            placeholderTextColor="#9ca3af"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Skill Level</Text>
                    <View style={styles.levelContainer}>
                        {levels.map((l) => (
                            <TouchableOpacity
                                key={l.value}
                                onPress={() => setLevel(l.value)}
                                style={[styles.levelBtn, level === l.value && { backgroundColor: l.color }]}
                            >
                                <Ionicons name={l.icon as any} size={20} color={level === l.value ? '#fff' : l.color} />
                                <Text style={[styles.levelBtnText, level === l.value && { color: '#fff' }]}>{l.value}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity onPress={handleSave} activeOpacity={0.8}>
                    <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.saveButton}>
                        <Ionicons name="checkmark-circle" size={24} color="#fff" />
                        <Text style={styles.saveButtonText}>Add Player</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    header: { paddingTop: 20, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    form: { flex: 1, padding: 20 },
    avatarSection: { alignItems: 'center', marginTop: -50, marginBottom: 24 },
    avatarLarge: { width: 100, height: 100, borderRadius: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#fff', shadowColor: '#6366f1', shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
    avatarText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
    inputGroup: { marginBottom: 20 },
    label: { color: '#374151', fontWeight: '600', marginBottom: 8, fontSize: 14 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, paddingVertical: 16, fontSize: 16, color: '#1f2937' },
    levelContainer: { flexDirection: 'row', gap: 10 },
    levelBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    levelBtnText: { fontWeight: '600', color: '#374151' },
    saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18, borderRadius: 16, marginTop: 20, marginBottom: 40, shadowColor: '#6366f1', shadowOpacity: 0.4, shadowRadius: 20, elevation: 8 },
    saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});
