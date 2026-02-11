import { theme } from '@/constants/theme';
import { TrainingSession } from '@/domain/models/Schedule';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useScheduleStore } from '@/store/useScheduleStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- CUSTOM NEON CALENDAR COMPONENT ---
const CustomCalendar = ({ onDateSelect, markedDates, rangeStart, rangeEnd, activePicking }: any) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        if (currentMonth < maxDate) {
            setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
        }
    };

    const isBetween = (date: string, start: string, end: string) => {
        if (!start || !end) return false;
        return date > start && date < end;
    };

    const renderDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
        const days = [];

        for (let i = 0; i < startDay; i++) {
            days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
        }

        for (let i = 1; i <= totalDays; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isStart = dateStr === rangeStart;
            const isEnd = dateStr === rangeEnd;
            const inRange = isBetween(dateStr, rangeStart, rangeEnd);
            const isMarked = markedDates[dateStr]?.marked;
            const todayStr = new Date().toISOString().split('T')[0];
            const isToday = todayStr === dateStr;
            const isPast = dateStr < todayStr;

            const isActivePick = (activePicking === 'start' && isStart) || (activePicking === 'end' && isEnd);

            days.push(
                <TouchableOpacity
                    key={dateStr}
                    onPress={() => !isPast && onDateSelect(dateStr)}
                    disabled={isPast}
                    style={[
                        styles.calendarDay,
                        (isStart || isEnd) && { backgroundColor: theme.primary.solid, borderRadius: 12 },
                        inRange && { backgroundColor: theme.primary.light, borderRadius: 0 },
                        isActivePick && { borderWidth: 2, borderColor: theme.secondary.orange },
                        isPast && { opacity: 0.2 }
                    ]}
                >
                    <Text style={[
                        styles.calendarDayText,
                        (isStart || isEnd) && { color: '#fff', fontWeight: 'bold' },
                        inRange && { color: theme.primary.solid, fontWeight: '600' },
                        isToday && !isStart && !isEnd && !inRange && { color: theme.primary.solid, fontWeight: '700' },
                        isPast && { color: theme.neutral.gray400 }
                    ]}>
                        {i}
                    </Text>
                    {isMarked && !isStart && !isEnd && !inRange && <View style={styles.dot} />}
                </TouchableOpacity>
            );
        }

        return days;
    };

    return (
        <View style={styles.customCalendar}>
            <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={handlePrevMonth}>
                    <Ionicons name="chevron-back" size={24} color={theme.primary.solid} />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>
                    {currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </Text>
                <TouchableOpacity onPress={handleNextMonth}>
                    <Ionicons name="chevron-forward" size={24} color={theme.primary.solid} />
                </TouchableOpacity>
            </View>
            <View style={styles.weekDays}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <Text key={i} style={styles.weekDayText}>{d}</Text>
                ))}
            </View>
            <View style={styles.daysGrid}>{renderDays()}</View>
        </View>
    );
};

export default function ScheduleScreen() {
    const { players } = usePlayerStore();
    const { sessions, addSession } = useScheduleStore();

    const [rangeStart, setRangeStart] = useState<string | null>(new Date().toLocaleDateString('en-CA'));
    const [rangeEnd, setRangeEnd] = useState<string | null>(null);

    const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
    const [isDatePickerModalVisible, setIsDatePickerModalVisible] = useState(false);
    const [pickingType, setPickingType] = useState<'start' | 'end'>('start');

    const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
    const [startTime, setStartTime] = useState('10:00');
    const [endTime, setEndTime] = useState('11:00');
    const [sessionType, setSessionType] = useState<'Private' | 'Group' | 'Match'>('Private');

    // Helper to format date without timezone shifts
    const formatLocalDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const handleDatePick = (date: string) => {
        const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
        if (date < todayStr) return;

        if (pickingType === 'start') {
            setRangeStart(date);
            if (rangeEnd && date > rangeEnd) {
                setRangeEnd(null);
            }
            setPickingType('end');
        } else {
            if (date < rangeStart!) {
                setRangeEnd(rangeStart);
                setRangeStart(date);
            } else {
                setRangeEnd(date === rangeStart ? null : date);
            }
            setPickingType('start');
        }
        setIsDatePickerModalVisible(false);
    };

    const activeSessions = useMemo(() => {
        if (!rangeStart) return [];
        return sessions.filter(s => {
            if (rangeEnd) {
                return s.date >= rangeStart && s.date <= rangeEnd;
            }
            return s.date === rangeStart;
        }).sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.startTime.localeCompare(b.startTime);
        });
    }, [sessions, rangeStart, rangeEnd]);

    const markedDates = useMemo(() => {
        const marks: any = {};
        sessions.forEach(s => {
            marks[s.date] = { marked: true };
        });
        return marks;
    }, [sessions]);

    const handleCreateSession = () => {
        if (selectedPlayerIds.length === 0 || !rangeStart) return;

        const selectedPlayers = players.filter(p => selectedPlayerIds.includes(p.id));
        if (selectedPlayers.length === 0) return;

        const datesToBook = [];
        if (rangeEnd) {
            let current = new Date(rangeStart);
            const end = new Date(rangeEnd);
            while (current <= end) {
                datesToBook.push(current.toISOString().split('T')[0]);
                current.setDate(current.getDate() + 1);
            }
        } else {
            datesToBook.push(rangeStart);
        }

        datesToBook.forEach(date => {
            const newSession: TrainingSession = {
                id: Math.random().toString(36).substr(2, 9),
                playerIds: selectedPlayerIds,
                playerNames: selectedPlayers.map(p => p.name),
                date: date,
                startTime: startTime,
                endTime: endTime,
                type: sessionType,
                status: 'Scheduled',
            };
            addSession(newSession);
        });

        setIsBookingModalVisible(false);
        setSelectedPlayerIds([]);
    };

    const togglePlayerSelection = (playerId: string) => {
        if (sessionType === 'Private') {
            setSelectedPlayerIds([playerId]);
        } else {
            setSelectedPlayerIds(prev =>
                prev.includes(playerId)
                    ? prev.filter(id => id !== playerId)
                    : [...prev, playerId]
            );
        }
    };

    const handleTypeChange = (type: 'Private' | 'Group' | 'Match') => {
        setSessionType(type);
        if (type === 'Private' && selectedPlayerIds.length > 1) {
            setSelectedPlayerIds([selectedPlayerIds[0]]);
        }
    };

    const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'];

    return (
        <LinearGradient colors={['#f3f4f6', '#e0e7ff', '#f3e8ff']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <LinearGradient colors={theme.gradients.primary} style={styles.header}>
                <Text style={styles.headerSub}>CoachKeith</Text>
                <Text style={styles.headerTitle}>Training Schedule</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.heroSpacer}>
                    <Ionicons name="calendar-outline" size={60} color="rgba(99, 102, 241, 0.15)" style={styles.heroIcon} />
                    <Text style={styles.heroText}>Select your dates below to manage the squad agenda.</Text>
                </View>

                <View style={styles.calendarContainer}>
                    <CustomCalendar
                        onDateSelect={handleDatePick}
                        rangeStart={rangeStart}
                        rangeEnd={rangeEnd}
                        markedDates={markedDates}
                        activePicking={pickingType}
                    />
                </View>

                <View style={styles.rangeDisplayContainer}>
                    <TouchableOpacity
                        style={[styles.dateInfoCard, pickingType === 'start' && styles.activeCardBorder]}
                        activeOpacity={0.8}
                        onPress={() => {
                            setPickingType('start');
                            setIsDatePickerModalVisible(true);
                        }}
                    >
                        <View style={[styles.dateIconBox, { backgroundColor: theme.primary.light }]}>
                            <Ionicons name="calendar-outline" size={20} color={theme.primary.solid} />
                        </View>
                        <View>
                            <Text style={styles.dateInfoLabel}>START DATE</Text>
                            <Text style={styles.dateInfoValue}>{rangeStart ? formatLocalDate(rangeStart) : 'Select...'}</Text>
                        </View>
                        <Ionicons name="chevron-down" size={14} color={theme.neutral.gray300} style={styles.dropdownIcon} />
                    </TouchableOpacity>

                    <Ionicons name="swap-horizontal" size={16} color={theme.neutral.gray400} style={{ alignSelf: 'center' }} />

                    <TouchableOpacity
                        style={[styles.dateInfoCard, pickingType === 'end' && styles.activeCardBorder]}
                        activeOpacity={0.8}
                        onPress={() => {
                            setPickingType('end');
                            setIsDatePickerModalVisible(true);
                        }}
                    >
                        <View style={[styles.dateIconBox, { backgroundColor: rangeEnd ? theme.functional.successBg : theme.neutral.gray100 }]}>
                            <Ionicons name="calendar" size={20} color={rangeEnd ? theme.functional.success : theme.neutral.gray400} />
                        </View>
                        <View>
                            <Text style={styles.dateInfoLabel}>END DATE</Text>
                            <Text style={[styles.dateInfoValue, !rangeEnd && { color: theme.neutral.gray400 }]}>
                                {rangeEnd ? formatLocalDate(rangeEnd) : 'One day...'}
                            </Text>
                        </View>
                        <Ionicons name="chevron-down" size={14} color={theme.neutral.gray300} style={styles.dropdownIcon} />
                    </TouchableOpacity>
                </View>

                {(rangeStart && rangeEnd) && (
                    <TouchableOpacity onPress={() => { setRangeEnd(null); setPickingType('start'); }} style={styles.clearRangeQuick}>
                        <Ionicons name="close-circle" size={14} color={theme.primary.solid} />
                        <Text style={styles.clearRangeTextQuick}>Reset to Single Day</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.agendaHeader}>
                    <View>
                        <Text style={styles.agendaTitle}>
                            {rangeEnd ? 'Range Agenda' : `Agenda for ${new Date(rangeStart || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                        </Text>
                        {rangeEnd && (
                            <Text style={styles.agendaSub}>
                                {formatLocalDate(rangeStart!)} - {formatLocalDate(rangeEnd)}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity onPress={() => setIsBookingModalVisible(true)} style={styles.addBtn}>
                        <LinearGradient colors={theme.gradients.secondary} style={styles.addBtnGradient}>
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.addBtnText}>{rangeEnd ? 'Book Range' : 'Book Session'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {activeSessions.length === 0 ? (
                    <View style={styles.emptyAgenga}>
                        <Ionicons name="calendar-outline" size={48} color={theme.neutral.gray300} />
                        <Text style={styles.emptyText}>No sessions in this period</Text>
                    </View>
                ) : (
                    activeSessions.map((session) => (
                        <View key={session.id} style={styles.sessionCard}>
                            <View style={[styles.timeBar, { backgroundColor: theme.primary.solid }]} />
                            <View style={styles.sessionMain}>
                                <View style={styles.sessionTopRow}>
                                    <View style={styles.timeTag}>
                                        <Text style={styles.sessionTime}>{session.startTime} - {session.endTime}</Text>
                                    </View>
                                    <View style={styles.sessionDateBadge}>
                                        <Text style={styles.sessionDateBadgeText}>{formatLocalDate(session.date)}</Text>
                                    </View>
                                </View>
                                <View style={styles.sessionDetails}>
                                    <Text style={styles.sessionPlayer} numberOfLines={1}>
                                        {session.playerNames.join(', ')}
                                    </Text>
                                    <View style={styles.sessionTypeBadge}>
                                        <Text style={styles.sessionTypeText}>{session.type}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.avatarGroup}>
                                {session.playerIds.slice(0, 3).map((pid, idx) => {
                                    const p = players.find(player => player.id === pid);
                                    return p?.imageUrl ? (
                                        <Image key={pid} source={{ uri: p.imageUrl }} style={[styles.playerMiniThumb, { marginLeft: idx > 0 ? -15 : 0 }]} />
                                    ) : (
                                        <View key={pid} style={[styles.playerMiniAvatar, { backgroundColor: theme.primary.solid, marginLeft: idx > 0 ? -15 : 0 }]}>
                                            <Text style={styles.miniAvatarText}>{p?.name.charAt(0)}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* DATE PICKER MODAL */}
            <Modal visible={isDatePickerModalVisible} animationType="fade" transparent={true}>
                <View style={styles.datePickerOverlay}>
                    <TouchableOpacity style={styles.datePickerDismiss} onPress={() => setIsDatePickerModalVisible(false)} />
                    <View style={styles.datePickerContent}>
                        <View style={styles.datePickerHeader}>
                            <Text style={styles.datePickerTitle}>Select {pickingType === 'start' ? 'Start' : 'End'} Date</Text>
                            <TouchableOpacity onPress={() => setIsDatePickerModalVisible(false)}>
                                <Ionicons name="close" size={24} color={theme.neutral.gray500} />
                            </TouchableOpacity>
                        </View>
                        <CustomCalendar
                            onDateSelect={handleDatePick}
                            rangeStart={rangeStart}
                            rangeEnd={rangeEnd}
                            markedDates={markedDates}
                            activePicking={pickingType}
                        />
                    </View>
                </View>
            </Modal>

            {/* Booking Modal */}
            <Modal visible={isBookingModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>Schedule Session(s)</Text>
                                <Text style={styles.modalSub}>
                                    {rangeEnd ? `Booking for ${rangeStart} to ${rangeEnd}` : `Booking for ${rangeStart}`}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsBookingModalVisible(false)}>
                                <Ionicons name="close" size={24} color={theme.neutral.gray500} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.inputLabel}>Session Type</Text>
                            <View style={styles.typeRow}>
                                {(['Private', 'Group', 'Match'] as const).map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        onPress={() => handleTypeChange(type)}
                                        style={[styles.typeBtn, sessionType === type && styles.typeBtnSelected]}
                                    >
                                        <Text style={[styles.typeBtnText, sessionType === type && styles.typeBtnTextSelected]}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Select {sessionType === 'Private' ? 'Player' : 'Players'}</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.playerPicker}>
                                {players.map(p => {
                                    const isSelected = selectedPlayerIds.includes(p.id);
                                    return (
                                        <TouchableOpacity
                                            key={p.id}
                                            onPress={() => togglePlayerSelection(p.id)}
                                            style={[styles.playerChip, isSelected && styles.playerChipSelected]}
                                        >
                                            <View style={styles.chipImageContainer}>
                                                {p.imageUrl ? (
                                                    <Image source={{ uri: p.imageUrl }} style={[styles.playerChipImg, isSelected && { borderColor: theme.primary.solid }]} />
                                                ) : (
                                                    <View style={[styles.playerChipAvatar, { backgroundColor: theme.primary.solid }]}>
                                                        <Text style={styles.avatarTxt}>{p.name.charAt(0)}</Text>
                                                    </View>
                                                )}
                                                {isSelected && (
                                                    <View style={styles.checkBadge}>
                                                        <Ionicons name="checkmark-circle" size={16} color={theme.primary.solid} />
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={[styles.playerChipName, isSelected && { color: theme.primary.solid, fontWeight: 'bold' }]}>{p.name.split(' ')[0]}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>

                            <Text style={styles.inputLabel}>Session Time Range</Text>
                            <View style={styles.timeRangeContainer}>
                                <View style={styles.timePickerBox}>
                                    <Text style={styles.timePickerLabel}>START</Text>
                                    <ScrollView nestedScrollEnabled style={styles.timeScroll}>
                                        {timeSlots.map(t => (
                                            <TouchableOpacity key={`start-${t}`} onPress={() => setStartTime(t)} style={[styles.timeSlotBtn, startTime === t && styles.timeSlotBtnSelected]}>
                                                <Text style={[styles.timeSlotText, startTime === t && styles.timeSlotTextSelected]}>{t}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                                <Ionicons name="arrow-forward" size={20} color={theme.neutral.gray400} style={{ marginHorizontal: 10 }} />
                                <View style={styles.timePickerBox}>
                                    <Text style={styles.timePickerLabel}>END</Text>
                                    <ScrollView nestedScrollEnabled style={styles.timeScroll}>
                                        {timeSlots.map(t => {
                                            const isPastStart = t > startTime;
                                            return (
                                                <TouchableOpacity
                                                    key={`end-${t}`}
                                                    onPress={() => isPastStart && setEndTime(t)}
                                                    style={[styles.timeSlotBtn, endTime === t && styles.timeSlotBtnSelected, !isPastStart && { opacity: 0.3 }]}
                                                    disabled={!isPastStart}
                                                >
                                                    <Text style={[styles.timeSlotText, endTime === t && styles.timeSlotTextSelected]}>{t}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.confirmBtn}
                                onPress={handleCreateSession}
                                disabled={selectedPlayerIds.length === 0 || endTime <= startTime}
                            >
                                <LinearGradient
                                    colors={selectedPlayerIds.length > 0 && endTime > startTime ? theme.gradients.primary : ['#e2e8f0', '#cbd5e1']}
                                    style={styles.confirmBtnGradient}
                                >
                                    <Text style={styles.confirmBtnText}>
                                        Confirm {rangeEnd ? 'Bulk Booking' : 'Booking'} ({selectedPlayerIds.length} players)
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 24, paddingTop: 16, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
    headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600', textTransform: 'uppercase' },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 4 },
    scrollContent: { paddingBottom: 100 },

    heroSpacer: { padding: 20, alignItems: 'center', justifyContent: 'center' },
    heroIcon: { marginBottom: 12 },
    heroText: { color: theme.neutral.gray500, fontSize: 13, textAlign: 'center', paddingHorizontal: 30, lineHeight: 18, fontWeight: '500' },

    calendarContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 24,
        padding: 20,
        ...theme.shadows.md,
    },

    rangeDisplayContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginBottom: 16,
        gap: 12,
    },
    dateInfoCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 2,
        borderColor: 'transparent',
        ...theme.shadows.sm,
    },
    activeCardBorder: { borderColor: theme.primary.solid },
    dateIconBox: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateInfoLabel: {
        fontSize: 9,
        fontWeight: '900',
        color: theme.neutral.gray400,
        letterSpacing: 0.8,
    },
    dateInfoValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.neutral.gray800,
        marginTop: 1,
    },
    dropdownIcon: { marginLeft: 'auto', opacity: 0.4 },

    clearRangeQuick: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 6
    },
    clearRangeTextQuick: { fontSize: 12, color: theme.primary.solid, fontWeight: 'bold' },

    agendaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 16 },
    agendaTitle: { fontSize: 20, fontWeight: '800', color: theme.neutral.gray900 },
    agendaSub: { fontSize: 12, color: theme.primary.solid, fontWeight: '600', marginTop: 2 },
    addBtn: { borderRadius: 14, overflow: 'hidden', ...theme.shadows.sm },
    addBtnGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
    addBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
    emptyAgenga: { alignItems: 'center', marginTop: 60, opacity: 0.5 },
    emptyText: { color: theme.neutral.gray500, marginTop: 12, fontSize: 14 },

    sessionCard: {
        backgroundColor: '#fff',
        marginHorizontal: 24,
        marginBottom: 16,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        ...theme.shadows.sm,
    },
    timeBar: { width: 4, height: 44, borderRadius: 2 },
    sessionMain: { flex: 1, paddingLeft: 16 },
    sessionTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    timeTag: { backgroundColor: '#f8fafc', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#f1f5f9' },
    sessionTime: { fontSize: 14, fontWeight: '700', color: theme.neutral.gray900 },
    sessionDateBadge: { backgroundColor: theme.primary.light, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    sessionDateBadgeText: { fontSize: 10, color: theme.primary.solid, fontWeight: '800' },
    sessionDetails: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
    sessionPlayer: { fontSize: 14, color: theme.neutral.gray600, flex: 1, fontWeight: '500' },
    sessionTypeBadge: { backgroundColor: '#f8fafc', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: '#f1f5f9' },
    sessionTypeText: { fontSize: 9, color: theme.neutral.gray500, fontWeight: '900', textTransform: 'uppercase' },

    avatarGroup: { flexDirection: 'row', alignItems: 'center', paddingLeft: 8 },
    playerMiniThumb: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: '#fff' },
    playerMiniAvatar: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    miniAvatarText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },

    datePickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
    datePickerDismiss: { ...StyleSheet.absoluteFillObject },
    datePickerContent: { backgroundColor: '#fff', borderRadius: 32, padding: 24, ...theme.shadows.lg },
    datePickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    datePickerTitle: { fontSize: 18, fontWeight: 'bold', color: theme.neutral.gray900 },

    customCalendar: { width: '100%' },
    calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    monthTitle: { fontSize: 18, fontWeight: 'bold', color: theme.neutral.gray800 },
    weekDays: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
    weekDayText: { color: theme.neutral.gray400, fontWeight: 'bold', fontSize: 12, width: 40, textAlign: 'center' },
    daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    calendarDay: { width: '14.28%', height: 42, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
    calendarDayText: { color: theme.neutral.gray700, fontSize: 15 },
    dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: theme.secondary.orange, marginTop: 3 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 36, borderTopRightRadius: 36, padding: 24, maxHeight: '90%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    modalTitle: { fontSize: 22, fontWeight: '900', color: theme.neutral.gray900 },
    modalSub: { fontSize: 13, color: theme.neutral.gray500, marginTop: 4 },
    inputLabel: { fontSize: 15, fontWeight: '800', color: theme.neutral.gray800, marginBottom: 12, marginTop: 16 },

    playerPicker: { marginBottom: 16 },
    playerChip: { alignItems: 'center', marginRight: 18, opacity: 0.6 },
    playerChipSelected: { opacity: 1 },
    chipImageContainer: { position: 'relative' },
    checkBadge: { position: 'absolute', bottom: -4, right: -4, backgroundColor: '#fff', borderRadius: 12 },
    playerChipImg: { width: 64, height: 64, borderRadius: 32, borderWidth: 3, borderColor: 'transparent' },
    playerChipAvatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
    avatarTxt: { color: '#fff', fontWeight: 'bold', fontSize: 22 },
    playerChipName: { fontSize: 13, marginTop: 6, color: theme.neutral.gray600, fontWeight: '600' },

    timeRangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        borderRadius: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginBottom: 20
    },
    timePickerBox: { flex: 1, alignItems: 'center' },
    timePickerLabel: { fontSize: 10, fontWeight: '900', color: theme.neutral.gray400, marginBottom: 10, letterSpacing: 1 },
    timeScroll: { height: 120, width: '100%' },
    timeSlotBtn: { paddingVertical: 10, alignItems: 'center', borderRadius: 12, marginBottom: 4 },
    timeSlotBtnSelected: { backgroundColor: theme.primary.solid },
    timeSlotText: { fontSize: 16, fontWeight: '700', color: theme.neutral.gray700 },
    timeSlotTextSelected: { color: '#fff' },

    typeRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
    typeBtn: { flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: '#f8fafc', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
    typeBtnSelected: { backgroundColor: theme.primary.solid, borderColor: theme.primary.solid },
    typeBtnText: { fontWeight: '800', color: theme.neutral.gray600, fontSize: 14 },
    typeBtnTextSelected: { color: '#fff' },
    confirmBtn: { borderRadius: 20, overflow: 'hidden', marginTop: 12 },
    confirmBtnGradient: { paddingVertical: 18, alignItems: 'center' },
    confirmBtnText: { color: '#fff', fontWeight: '800', fontSize: 17 },
});
