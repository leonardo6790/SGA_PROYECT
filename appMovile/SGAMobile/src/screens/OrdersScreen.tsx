import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { alquileresService, Alquiler } from '../services/alquileresService';
import { pagoApi } from '../api/pagoApi';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';
import { useFocusEffect } from '@react-navigation/native';

interface ArticleCard {
  id: string;
  alquilerId: number;
  articuloId: number;
  clienteDocumento: string;
  nombreCliente: string;
  telefono: string;
  fechaAlquiler: string;
  fechaEntrega: string;
  fechaRetiro: string;
  articulo: string;
  talla: string;
  precio: number;
  total: number;
  entregado: boolean;
  devuelto: boolean;
  observaciones: string;
}

interface Pago {
  idPago: number;
  valAbo: number;
  fechaUltimoAbono: string;
}

export const OrdersScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [alquileres, setAlquileres] = useState<Alquiler[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'entregar' | 'recibir'>('entregar');

  // Estados para modales
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentListModal, setShowPaymentListModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ArticleCard | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentList, setPaymentList] = useState<Pago[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [currentSaldoPendiente, setCurrentSaldoPendiente] = useState(0);

  // Estados para filtrado por fecha
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchMode, setSearchMode] = useState<'day' | 'week' | null>(null);
  const [filterActive, setFilterActive] = useState(false);

  // Recargar cuando la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      loadAlquileres();
    }, [])
  );

  useEffect(() => {
    loadAlquileres();
  }, []);

  const loadAlquileres = async () => {
    try {
      setLoading(true);
      const data = await alquileresService.getAll();
      setAlquileres(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar alquileres');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAlquileres();
    setRefreshing(false);
  };

  const handleNuevoAlquiler = () => {
    navigation.navigate('NewRent');
  };

  // ===== FUNCIONES DE DETALLE =====
  const handleViewDetails = (card: ArticleCard) => {
    setSelectedCard(card);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedCard(null);
  };

  // ===== FUNCIONES DE PAGO =====
  const handleOpenPaymentModal = async (card: ArticleCard) => {
    try {
      const pagos = await pagoApi.obtenerPagosPorAlquiler(card.alquilerId);
      const totalPagado = pagos.reduce((sum, pago) => sum + (pago.valAbo || 0), 0);
      const saldoPendiente = card.total - totalPagado;

      if (saldoPendiente <= 0) {
        Alert.alert('Información', 'Este alquiler ya ha sido pagado en su totalidad.');
        return;
      }

      setSelectedCard(card);
      setCurrentSaldoPendiente(saldoPendiente);
      setPaymentAmount('');
      setShowPaymentModal(true);
    } catch (error: any) {
      Alert.alert('Error', 'Error al verificar pagos');
    }
  };

  const handleSavePayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido');
      return;
    }

    try {
      if (!selectedCard) return;

      const montoPago = parseInt(paymentAmount);
      if (montoPago > currentSaldoPendiente) {
        Alert.alert('Error', `El monto supera el saldo pendiente de $${currentSaldoPendiente.toLocaleString()}`);
        return;
      }

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const fechaFormatted = parseInt(`${year}${month}${day}`);

      const pagoData = {
        idAlquiler: selectedCard.alquilerId,
        valAbo: montoPago,
        fechaUltimoAbono: fechaFormatted,
      };

      console.log('Enviando pago:', pagoData);
      await pagoApi.crearPago(pagoData);
      Alert.alert('Éxito', 'Pago registrado correctamente');
      setShowPaymentModal(false);
      loadAlquileres();
    } catch (error: any) {
      console.error('Error al registrar pago:', error);
      Alert.alert('Error', error.message || 'Error al registrar pago');
    }
  };

  const handleOpenPaymentList = async (card: ArticleCard) => {
    setSelectedCard(card);
    setLoadingPayments(true);
    setShowPaymentListModal(true);

    try {
      const pagos = await pagoApi.obtenerPagosPorAlquiler(card.alquilerId);
      setPaymentList(pagos || []);
    } catch (error: any) {
      Alert.alert('Error', 'Error al cargar pagos');
      setPaymentList([]);
    } finally {
      setLoadingPayments(false);
    }
  };

  const calcularTotalPagado = () => {
    return paymentList.reduce((sum, pago) => sum + (pago.valAbo || 0), 0);
  };

  const calcularSaldoPendiente = () => {
    if (!selectedCard) return 0;
    return selectedCard.total - calcularTotalPagado();
  };

  // ===== FUNCIONES DE ESTADO =====
  const handleMarcarEntregado = async (card: ArticleCard) => {
    try {
      // Verificar que esté pagado
      const pagos = await pagoApi.obtenerPagosPorAlquiler(card.alquilerId);
      const totalPagado = pagos.reduce((sum, pago) => sum + (pago.valAbo || 0), 0);

      if (totalPagado < card.total) {
        const saldoPendiente = card.total - totalPagado;
        Alert.alert('Error', `El alquiler tiene un saldo pendiente de $${saldoPendiente.toLocaleString()}. Por favor, realiza el pago completo antes de entregar.`);
        return;
      }

      Alert.alert(
        'Confirmar',
        `¿Marcar "${card.articulo}" como entregado?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Entregar',
            onPress: async () => {
              try {
                await alquileresService.marcarComoEntregado(card.alquilerId, card.articuloId);
                Alert.alert('Éxito', 'Artículo marcado como entregado');
                loadAlquileres();
              } catch (error: any) {
                Alert.alert('Error', error.message);
              }
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleMarcarDevuelto = async (card: ArticleCard) => {
    Alert.alert(
      'Confirmar',
      `¿Marcar "${card.articulo}" como devuelto?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Devolver',
          onPress: async () => {
            try {
              await alquileresService.marcarComoDevuelto(card.alquilerId, card.articuloId);
              Alert.alert('Éxito', 'Artículo marcado como devuelto');
              loadAlquileres();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  // ===== FUNCIONES DE FILTRADO POR FECHA =====
  const getWeekRange = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que la semana comience el lunes
    const monday = new Date(d.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);

    return {
      start: dateToString(monday),
      end: dateToString(sunday),
    };
  };

  const dateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSearchByDay = () => {
    setSearchMode('day');
    setFilterActive(true);
    setShowCalendar(false);
  };

  const handleSearchByWeek = () => {
    setSearchMode('week');
    setFilterActive(true);
    setShowCalendar(false);
  };

  const handleClearDateFilter = () => {
    setFilterActive(false);
    setSearchMode(null);
    setSelectedDate(new Date());
    setShowCalendar(false);
  };

  // Renderizar días del calendario
  const renderCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1; // Ajustar para que lunes sea el primer día

    // Añadir espacios en blanco para días del mes anterior
    for (let i = 0; i < adjustedStart; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.calendarDayEmpty} />
      );
    }

    // Añadir días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dateStr = dateToString(currentDate);
      const isSelected = dateStr === dateToString(selectedDate);

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isSelected && styles.calendarDaySelected
          ]}
          onPress={() => {
            console.log('📅 Día presionado:', day, 'Modo:', searchMode);
            setSelectedDate(currentDate);
            setFilterActive(true);
            setShowCalendar(false);
            console.log('📅 Filtro activado para:', dateToString(currentDate));
          }}
        >
          <Text style={[
            styles.calendarDayText,
            isSelected && styles.calendarDayTextSelected
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  // Expandir alquileres a cards individuales por artículo
  const getArticleCards = () => {
    let cards: any[] = [];
    alquileres.forEach(alquiler => {
      alquiler.articulos.forEach(articulo => {
        const shouldShow = activeTab === 'entregar' 
          ? !articulo.entregado  // Tab "entregar": mostrar si NO está entregado
          : articulo.entregado && !articulo.estado;  // Tab "recibir": mostrar si está entregado PERO NO devuelto
          
        if (shouldShow) {
          cards.push({
            id: `${alquiler.id}-${articulo.articuloId}`,
            alquilerId: alquiler.id,
            articuloId: articulo.articuloId,
            clienteDocumento: alquiler.clienteDocumento,
            fechaAlquiler: alquiler.fechaAlquiler,
            fechaEntrega: alquiler.fechaEntrega,
            fechaRetiro: alquiler.fechaRetiro,
            articulo: articulo.nombreArticulo,
            talla: articulo.talla,
            precio: articulo.precio,
            total: alquiler.total,
            entregado: articulo.entregado,
            devuelto: articulo.estado,
            observaciones: articulo.observaciones,
          });
        }
      });
    });

    // Aplicar filtro por fecha si está activo
    if (filterActive && searchMode) {
      const selectedDateStr = dateToString(selectedDate);

      cards = cards.filter(card => {
        // Seleccionar la fecha correcta según el tab activo
        const cardDateStr = activeTab === 'entregar' 
          ? card.fechaEntrega      // "Por Entregar" → filtrar por fecha de entrega
          : card.fechaRetiro;      // "Por Recibir" → filtrar por fecha de devolución

        if (searchMode === 'day') {
          // Filtrar por día exacto
          return cardDateStr === selectedDateStr;
        } else if (searchMode === 'week') {
          // Filtrar por semana (lunes a domingo)
          const weekRange = getWeekRange(selectedDate);
          return cardDateStr >= weekRange.start && cardDateStr <= weekRange.end;
        }
        return true;
      });
    }

    return cards;
  };

  const renderArticleCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleSection}>
          <Text style={styles.cardTitle}>{item.articulo}</Text>
          <View style={[
            styles.statusBadge, 
            item.devuelto ? styles.statusCompleted : styles.statusPending
          ]}>
            <Text style={styles.statusBadgeText}>
              {item.devuelto ? '✓ Completado' : '⏳ Pendiente'}
            </Text>
          </View>
        </View>
        <Text style={styles.cardPrice}>${item.precio.toLocaleString('es-CO')}</Text>
      </View>
      
      <View style={styles.cardBody}>
        <Text style={styles.cardDetail}>
          👤 Cliente: {item.clienteDocumento}
        </Text>
        {item.talla && (
          <Text style={styles.cardDetail}>
            👕 Talla: {item.talla}
          </Text>
        )}
        <Text style={styles.cardDetail}>
          📅 Alquiler: {new Date(item.fechaAlquiler).toLocaleDateString('es-CO')}
        </Text>
        <Text style={styles.cardDetail}>
          📤 Entrega: {new Date(item.fechaEntrega).toLocaleDateString('es-CO')}
        </Text>
        <Text style={styles.cardDetail}>
          📥 Retiro: {new Date(item.fechaRetiro).toLocaleDateString('es-CO')}
        </Text>
        <Text style={styles.cardDetail}>
          💰 Total alquiler: ${item.total.toLocaleString('es-CO')}
        </Text>
        {item.observaciones && (
          <Text style={styles.cardDetail}>
            📝 {item.observaciones}
          </Text>
        )}
      </View>

      <View style={styles.cardActions}>
        <View style={styles.actionButtonsRow}>
          {/* Botón Ver Detalles */}
          <TouchableOpacity
            style={[styles.smallIconButton, styles.viewButton]}
            onPress={() => handleViewDetails(item)}
            title="Ver detalles"
          >
            <Text style={styles.smallIconButtonText}>👁️</Text>
          </TouchableOpacity>

          {/* Botón Pago - Solo en tab "entregar" */}
          {activeTab === 'entregar' && (
            <TouchableOpacity
              style={[styles.smallIconButton, styles.paymentButton]}
              onPress={() => handleOpenPaymentModal(item)}
              title="Agregar pago"
            >
              <Text style={styles.smallIconButtonText}>💵</Text>
            </TouchableOpacity>
          )}

          {/* Botón Ver Pagos */}
          <TouchableOpacity
            style={[styles.smallIconButton, styles.listPaymentButton]}
            onPress={() => handleOpenPaymentList(item)}
            title="Ver pagos"
          >
            <Text style={styles.smallIconButtonText}>📋</Text>
          </TouchableOpacity>

          {/* Botón Entregar/Devolver */}
          <TouchableOpacity
            style={[styles.smallIconButton, activeTab === 'entregar' ? styles.deliverButton : styles.returnButton]}
            onPress={() => activeTab === 'entregar' ? handleMarcarEntregado(item) : handleMarcarDevuelto(item)}
            title={activeTab === 'entregar' ? 'Marcar entregado' : 'Marcar devuelto'}
          >
            <Text style={styles.smallIconButtonText}>{activeTab === 'entregar' ? '✓' : '↩️'}</Text>
          </TouchableOpacity>

          {/* Botón Editar */}
          <TouchableOpacity
            style={[styles.smallIconButton, styles.editButton]}
            onPress={() => {
              setSelectedCard(item);
              setShowEditModal(true);
            }}
            title="Editar"
          >
            <Text style={styles.smallIconButtonText}>✏️</Text>
          </TouchableOpacity>

          {/* Botón Eliminar */}
          <TouchableOpacity
            style={[styles.smallIconButton, styles.deleteButton]}
            onPress={() => {
              Alert.alert(
                'Eliminar',
                `¿Está seguro de eliminar "${item.articulo}"?`,
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Eliminar',
                    onPress: () => Alert.alert('Eliminado', 'Artículo eliminado exitosamente'),
                    style: 'destructive',
                  },
                ]
              );
            }}
            title="Eliminar"
          >
            <Text style={styles.smallIconButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando órdenes...</Text>
      </View>
    );
  }

  const articleCards = getArticleCards();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Órdenes</Text>
        <Text style={styles.subtitle}>
          {articleCards.length} artículo(s)
        </Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'entregar' && styles.tabActive]}
          onPress={() => {
            setActiveTab('entregar');
            handleClearDateFilter();
          }}
        >
          <Text style={[styles.tabText, activeTab === 'entregar' && styles.tabTextActive]}>
            📤 Por Entregar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recibir' && styles.tabActive]}
          onPress={() => {
            setActiveTab('recibir');
            handleClearDateFilter();
          }}
        >
          <Text style={[styles.tabText, activeTab === 'recibir' && styles.tabTextActive]}>
            📥 Por Recibir
          </Text>
        </TouchableOpacity>
      </View>

      {/* SECCIÓN DE FILTRADO POR FECHA */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Filtrar por fecha</Text>
        
        {showCalendar && (
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                onPress={() => {
                  const prevMonth = new Date(selectedDate);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setSelectedDate(prevMonth);
                }}
              >
                <Text style={styles.calendarNavButton}>{'<'}</Text>
              </TouchableOpacity>
              
              <Text style={styles.calendarMonthYear}>
                {selectedDate.toLocaleString('es-CO', { month: 'long', year: 'numeric' })}
              </Text>
              
              <TouchableOpacity
                onPress={() => {
                  const nextMonth = new Date(selectedDate);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setSelectedDate(nextMonth);
                }}
              >
                <Text style={styles.calendarNavButton}>{'>'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calendarDaysHeader}>
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
                <Text key={idx} style={styles.calendarDayHeader}>{day}</Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {renderCalendarDays()}
            </View>
          </View>
        )}

        <View style={styles.filterButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              searchMode === 'day' && styles.filterButtonActive
            ]}
            onPress={() => {
              if (searchMode !== 'day') {
                setSearchMode('day');
              }
              setShowCalendar(!showCalendar);
            }}
          >
            <Text style={[
              styles.filterButtonText,
              searchMode === 'day' && styles.filterButtonTextActive
            ]}>
              📅 Buscar por día
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              searchMode === 'week' && styles.filterButtonActive
            ]}
            onPress={() => {
              if (searchMode !== 'week') {
                setSearchMode('week');
              }
              setShowCalendar(!showCalendar);
            }}
          >
            <Text style={[
              styles.filterButtonText,
              searchMode === 'week' && styles.filterButtonTextActive
            ]}>
              📆 Buscar por semana
            </Text>
          </TouchableOpacity>

          {filterActive && (
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={handleClearDateFilter}
            >
              <Text style={styles.clearFilterButtonText}>✕ Limpiar</Text>
            </TouchableOpacity>
          )}
        </View>

        {filterActive && (
          <View style={styles.filterStatusContainer}>
            <Text style={styles.filterStatusText}>
              {searchMode === 'day' 
                ? `Buscando ${activeTab === 'entregar' ? 'entrega' : 'devolución'}: ${selectedDate.toLocaleDateString('es-CO')}`
                : `Buscando semana ${activeTab === 'entregar' ? 'de entrega' : 'de devolución'}: ${getWeekRange(selectedDate).start} a ${getWeekRange(selectedDate).end}`
              }
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={articleCards}
        renderItem={renderArticleCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📭</Text>
            <Text style={styles.emptyTitle}>No hay órdenes</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'entregar'
                ? 'No hay artículos pendientes por entregar'
                : 'No hay artículos pendientes por recibir'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handleNuevoAlquiler}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* MODAL DE DETALLES */}
      <Modal visible={showDetailModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalles de la Orden</Text>
            {selectedCard && (
              <ScrollView>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>ID Alquiler:</Text>
                  <Text style={styles.modalValue}>#{selectedCard.alquilerId}</Text>

                  <Text style={styles.modalLabel}>Artículo:</Text>
                  <Text style={styles.modalValue}>{selectedCard.articulo}</Text>

                  <Text style={styles.modalLabel}>Talla:</Text>
                  <Text style={styles.modalValue}>{selectedCard.talla || 'N/A'}</Text>

                  <Text style={styles.modalLabel}>Precio:</Text>
                  <Text style={styles.modalValue}>${selectedCard.precio.toLocaleString('es-CO')}</Text>

                  <Text style={styles.modalLabel}>Total:</Text>
                  <Text style={styles.modalValue}>${selectedCard.total.toLocaleString('es-CO')}</Text>

                  <Text style={styles.modalLabel}>Cliente:</Text>
                  <Text style={styles.modalValue}>{selectedCard.clienteDocumento}</Text>

                  <Text style={styles.modalLabel}>Teléfono:</Text>
                  <Text style={styles.modalValue}>{selectedCard.telefono || 'N/A'}</Text>

                  <Text style={styles.modalLabel}>Fecha Alquiler:</Text>
                  <Text style={styles.modalValue}>{selectedCard.fechaAlquiler}</Text>

                  <Text style={styles.modalLabel}>Fecha Entrega:</Text>
                  <Text style={styles.modalValue}>{selectedCard.fechaEntrega}</Text>

                  <Text style={styles.modalLabel}>Fecha Retiro:</Text>
                  <Text style={styles.modalValue}>{selectedCard.fechaRetiro}</Text>

                  {selectedCard.observaciones && (
                    <>
                      <Text style={styles.modalLabel}>Observaciones:</Text>
                      <Text style={styles.modalValue}>{selectedCard.observaciones}</Text>
                    </>
                  )}
                </View>
              </ScrollView>
            )}
            <TouchableOpacity style={styles.modalButton} onPress={closeDetailModal}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL DE PAGO */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Pago</Text>
            {selectedCard && (
              <ScrollView>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Alquiler #{selectedCard.alquilerId}</Text>
                  <Text style={styles.modalLabel}>Artículo:</Text>
                  <Text style={styles.modalValue}>{selectedCard.articulo}</Text>

                  <Text style={styles.modalLabel}>Total del Alquiler:</Text>
                  <Text style={styles.modalValue}>${selectedCard.total.toLocaleString('es-CO')}</Text>

                  <Text style={styles.modalLabel}>Saldo Pendiente:</Text>
                  <Text style={[styles.modalValue, { color: '#e74c3c' }]}>
                    ${currentSaldoPendiente.toLocaleString('es-CO')}
                  </Text>

                  <Text style={styles.modalLabel}>Monto del Pago:</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Ingrese el monto"
                    keyboardType="numeric"
                    value={paymentAmount}
                    onChangeText={setPaymentAmount}
                  />
                </View>
              </ScrollView>
            )}
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSavePayment}>
                <Text style={styles.modalButtonText}>Guardar Pago</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DE LISTA DE PAGOS */}
      <Modal visible={showPaymentListModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📋 Historial de Pagos</Text>
            {loadingPayments ? (
              <ActivityIndicator size="large" color="#c99d6a" />
            ) : (
              <ScrollView>
                <View style={styles.modalSection}>
                  {selectedCard && (
                    <>
                      <Text style={styles.modalLabel}>Alquiler:</Text>
                      <Text style={styles.modalValue}>#{selectedCard.alquilerId}</Text>

                      <Text style={styles.modalLabel}>Artículo:</Text>
                      <Text style={styles.modalValue}>{selectedCard.articulo}</Text>

                      <Text style={styles.modalLabel}>Total Alquiler:</Text>
                      <Text style={styles.modalValue}>${selectedCard.total.toLocaleString('es-CO')}</Text>

                      <Text style={styles.modalLabel}>Total Pagado:</Text>
                      <Text style={[styles.modalValue, { color: '#2ecc71' }]}>
                        ${calcularTotalPagado().toLocaleString('es-CO')}
                      </Text>

                      <Text style={styles.modalLabel}>Saldo Pendiente:</Text>
                      <Text style={[styles.modalValue, { color: calcularSaldoPendiente() > 0 ? '#e74c3c' : '#2ecc71' }]}>
                        ${calcularSaldoPendiente().toLocaleString('es-CO')}
                      </Text>
                    </>
                  )}

                  <Text style={[styles.modalLabel, { marginTop: SPACING.lg }]}>Pagos Registrados:</Text>
                  {paymentList.length === 0 ? (
                    <Text style={styles.modalValue}>No hay pagos registrados</Text>
                  ) : (
                    paymentList.map((pago, idx) => (
                      <View key={idx} style={styles.paymentItem}>
                        <Text style={styles.paymentDate}>Fecha: {pago.fechaUltimoAbono}</Text>
                        <Text style={styles.paymentAmount}>Monto: ${pago.valAbo.toLocaleString('es-CO')}</Text>
                      </View>
                    ))
                  )}
                </View>
              </ScrollView>
            )}
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => setShowPaymentListModal(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5ead6', // Beige
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5ead6',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: '#666',
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#d4a574', // Tan
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: '#2c2c2c', // Dark
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: '#666',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#e5d4c1',
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#c99d6a', // Brown
  },
  tabText: {
    fontSize: FONT_SIZES.md,
    color: '#999',
  },
  tabTextActive: {
    color: '#c99d6a', // Brown
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: '#c99d6a', // Brown left border
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#d4a574',
  },
  cardTitleSection: {
    flex: 1,
    marginRight: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: '#2c2c2c',
    flex: 1,
    marginBottom: SPACING.xs,
  },
  statusBadge: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  statusCompleted: {
    backgroundColor: '#d4edda', // Verde claro
  },
  statusPending: {
    backgroundColor: '#fff3cd', // Amarillo claro
  },
  statusBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: '#2c2c2c',
  },
  cardPrice: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: '#c99d6a', // Brown for price
  },
  cardBody: {
    marginBottom: SPACING.md,
  },
  cardDetail: {
    fontSize: FONT_SIZES.sm,
    color: '#666',
    marginBottom: SPACING.xs,
  },
  cardActions: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#d4a574',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    flexWrap: 'nowrap',
  },
  smallIconButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  smallIconButtonText: {
    fontSize: 20,
    textAlign: 'center',
  },
  viewButton: {
    backgroundColor: '#3498db', // Blue
  },
  paymentButton: {
    backgroundColor: '#27ae60', // Green
  },
  deliverButton: {
    backgroundColor: '#2ecc71', // Light green
  },
  listPaymentButton: {
    backgroundColor: '#f39c12', // Orange/Amber
  },
  editButton: {
    backgroundColor: '#3498db', // Blue
  },
  deleteButton: {
    backgroundColor: '#e67e22', // Orange
  },
  returnButton: {
    backgroundColor: '#c99d6a', // Brown
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: '#2c2c2c',
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#c99d6a', // Brown
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
  // ===== ESTILOS DE MODALES =====
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '85%',
    borderTopWidth: 3,
    borderTopColor: '#c99d6a',
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: '#2c2c2c',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  modalSection: {
    marginBottom: SPACING.lg,
  },
  modalLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: '#666',
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  modalValue: {
    fontSize: FONT_SIZES.md,
    color: '#2c2c2c',
    marginBottom: SPACING.sm,
  },
  modalInput: {
    borderWidth: 2,
    borderColor: '#d4a574',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: '#2c2c2c',
    backgroundColor: '#f9f6f1',
    marginBottom: SPACING.md,
  },
  modalButton: {
    backgroundColor: '#c99d6a',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  modalButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: '#fff',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
  },
  paymentItem: {
    backgroundColor: '#f9f6f1',
    borderLeftWidth: 4,
    borderLeftColor: '#c99d6a',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  paymentDate: {
    fontSize: FONT_SIZES.sm,
    color: '#666',
    marginBottom: SPACING.xs,
  },
  paymentAmount: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: '#c99d6a',
  },
  listPaymentButton: {
    backgroundColor: '#f39c12', // Orange/Amber
  },
  editButton: {
    backgroundColor: '#3498db', // Blue
  },
  // ===== ESTILOS PARA FILTRADO POR FECHA =====
  filterSection: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#e5d4c1',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  filterTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: '#2c2c2c',
    marginBottom: SPACING.md,
  },
  calendarContainer: {
    backgroundColor: '#f9f6f1',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#d4a574',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  calendarNavButton: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: '#c99d6a',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  calendarMonthYear: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: '#2c2c2c',
  },
  calendarDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.sm,
  },
  calendarDayHeader: {
    width: '14%',
    textAlign: 'center',
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  calendarDay: {
    width: '14%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5d4c1',
  },
  calendarDayEmpty: {
    width: '14%',
    aspectRatio: 1,
  },
  calendarDaySelected: {
    backgroundColor: '#c99d6a',
    borderColor: '#c99d6a',
  },
  calendarDayText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: '#2c2c2c',
  },
  calendarDayTextSelected: {
    color: '#fff',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  filterButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#d4a574',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#c99d6a',
    borderColor: '#c99d6a',
  },
  filterButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  clearFilterButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearFilterButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: '#fff',
  },
  filterStatusContainer: {
    backgroundColor: '#d4edda',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  filterStatusText: {
    fontSize: FONT_SIZES.sm,
    color: '#155724',
    fontWeight: '500',
  },
});
