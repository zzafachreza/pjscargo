import { Alert, StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { apiURL, getData, MYAPP, storeData } from '../../utils/localStorage';
import { colors, fonts, windowHeight, windowWidth } from '../../utils';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import Sound from 'react-native-sound';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { MyButton, MyGap, MyInput, MyPicker } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import DatePicker from 'react-native-datepicker'
import { maskJs, maskCurrency } from 'mask-js';
import moment from 'moment';
import ZavalabsScanner from 'react-native-zavalabs-scanner'
import 'moment/locale/id';
export default function SAdd({ navigation, route }) {

    const [loading, setLoading] = useState(false);
    const [manual, setManual] = useState(false);

    const [kirim, setKirim] = useState({
        barcode: '',
        tujuan: '20/GR',
        jenis: 'PART',
        jumlah: '',


    });



    const sendServer = () => {
        console.log(kirim);


        if (kirim.jumlah.length == 0) {
            showMessage({
                type: 'danger',
                message: 'Jumlah barang masih kosong !'
            })
        } else {
            setLoading(true);
            axios.post(apiURL + 'hasil_add', kirim).then(res => {
                console.log(res.data);
                setLoading(false);
                if (res.data.status == 200) {
                    Alert.alert(MYAPP, 'Data berhasil di simpan !');
                    navigation.goBack();
                } else {
                    showMessage({
                        type: 'danger',
                        message: res.data.message
                    })
                }
            })
        }
        // setLoading(true);


    }

    const [region, setRegion] = useState([]);

    useEffect(() => {

        axios.post(apiURL + 'region').then(res => {
            console.log(res.data);
            setRegion(res.data);
            setKirim({
                ...kirim,
                region: res.data[0].value
            })
        })

    }, [])

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.white,
            padding: 20,
        }}>


            <ScrollView showsVerticalScrollIndicator={false}>


                <View style={{
                    flexDirection: 'row'
                }}>
                    <View style={{
                        flex: 1,
                    }}>
                        <MyInput value={kirim.barcode} onChangeText={x => {
                            setKirim({
                                ...kirim,
                                barcode: x
                            })
                        }} label="Barcode" placeholder="Masukan barcode manual" iconname="barcode" />
                    </View>
                    <View style={{
                        marginLeft: 5,
                        justifyContent: 'flex-end'
                    }}>
                        <TouchableOpacity onPress={() => {
                            ZavalabsScanner.showBarcodeReader(result => {


                                if (result !== null) {
                                    setKirim({
                                        ...kirim,
                                        barcode: result
                                    })
                                }


                            })
                        }} style={{
                            backgroundColor: colors.primary,
                            paddingHorizontal: 15,
                            height: 48,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                            borderRadius: 10,
                        }}>
                            <Icon type='ionicon' name='barcode' size={35} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>
                <MyGap jarak={10} />
                {!manual && <MyPicker iconname="location" onValueChange={x => {
                    if (x == 'INPUT MANUAL') {
                        setKirim({ ...kirim, tujuan: '' })
                        setManual(true);
                    } else {
                        setKirim({ ...kirim, tujuan: x });
                        setManual(false);
                    }
                }} label="Tujuan" data={[
                    { label: '20/GR', value: '20/GR', },
                    { label: '21/BP', value: '21/BP', },
                    { label: '14/BA', value: '14/BA', },
                    { label: '15/SKP', value: '15/SKP', },
                    { label: 'OTO EXP', value: 'OTO EXP', },
                    { label: 'TPI', value: 'TPI', },
                    { label: 'TOKO BATAM', value: 'TOKO BATAM', },
                    { label: 'INPUT MANUAL', value: 'INPUT MANUAL', },

                ]} />}

                {manual && <MyInput value={kirim.tujuan} label="Tujuan" placeholder="Tujuan" iconname="location" onChangeText={x => setKirim({ ...kirim, tujuan: x })} />}

                <MyGap jarak={10} />
                <MyPicker iconname="cube" onValueChange={x => setKirim({ ...kirim, jenis: x })} label="Jenis" data={[
                    { label: 'PART', value: 'PART', },
                    { label: 'OLI', value: 'OLI', },
                    { label: 'BATERAI', value: 'BATERAI', },
                    { label: 'ATAP', value: 'ATAP' },
                    { label: 'BOX BESAR', value: 'BOX BESAR' },
                    { label: 'BOX SEDANG', value: 'BOX SEDANG' },
                    { label: 'KOTAK KECIL', value: 'KOTAK KECIL' },
                    { label: 'BUMPER', value: 'BUMPER' },
                    { label: 'KURSI', value: 'KURSI' },
                    { label: 'VELG', value: 'VELG' },
                    { label: 'FENDER', value: 'FENDER' },
                    { label: 'SUPPORT ( KECIL)', value: 'SUPPORT ( KECIL)' },
                    { label: 'KAP MESIN', value: 'KAP MESIN' },
                    { label: 'PANEL', value: 'PANEL' },
                    { label: 'PINTU', value: 'PINTU' },
                    { label: 'KACA BESAR', value: 'KACA BESAR' },
                    { label: 'KACA KEGIL', value: 'KACA KEGIL' },
                    { label: 'PATKIT', value: 'PATKIT' },
                    { label: 'LAMPU', value: 'LAMPU' },
                    { label: 'KROS MEMBER', value: 'KROS MEMBER' },
                    { label: 'RADIATOR', value: 'RADIATOR' },
                    { label: 'GRILL', value: 'GRILL' },
                    { label: 'LINES', value: 'LINES' },
                    { label: 'PER', value: 'PER' },
                    { label: 'STERING', value: 'STERING' },
                    { label: 'DLL', value: 'DLL' },

                ]} />
                <MyGap jarak={10} />
                <MyInput value={kirim.jumlah} label="Jumlah Barang" placeholder="Masukan jumlah barang" keyboardType="number-pad" iconname="apps" onChangeText={x => setKirim({ ...kirim, jumlah: x })} />

            </ScrollView>

            <MyGap jarak={20} />
            {!loading && <MyButton onPress={sendServer} title="SIMPAN" warna={colors.primary} Icons="person-add" />}

            {
                loading && <ActivityIndicator size="large" color={colors.primary} />
            }
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({})