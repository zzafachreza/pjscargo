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
export default function SAdd2({ navigation, route }) {

    const [loading, setLoading] = useState(false);
    const [manual, setManual] = useState(false);

    const [kirim, setKirim] = useState({
        no_vanning: '',
        barcode: '',
        tujuan: '20/GR',
        jenis: '',
        jumlah: '',
        status: 'PENDING'
    });



    const sendServer = () => {
        console.log(kirim);
        if (route.params !== undefined) {

            axios.post(apiURL + 'hasil_delete2', {
                id: route.params.id
            }).then(res => {

                __add();

            })
        } else {
            __add();
        }





        // setLoading(true);


    }


    const __add = () => {
        if (kirim.jumlah.length == 0) {
            showMessage({
                type: 'danger',
                message: 'Jumlah barang masih kosong !'
            })
        } else {
            // setLoading(true);
            axios.post(apiURL + 'hasil_add2', kirim).then(res => {
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
    }

    const [region, setRegion] = useState([]);

    useEffect(() => {

        console.log(route.params)
        if (route.params !== undefined) {
            setKirim(route.params)

        }

    }, [])

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.white,
            padding: 20,
        }}>


            <ScrollView showsVerticalScrollIndicator={false}>


                <MyInput value={kirim.no_vanning} label="No. Vanning" placeholder="masukan no vanning" iconname="card" onChangeText={x => setKirim({ ...kirim, no_vanning: x })} />
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
                <MyInput value={kirim.jenis} label="Jenis Barang" placeholder="Masukan jenis barang" iconname="cube" onChangeText={x => setKirim({ ...kirim, jenis: x })} />
                <MyGap jarak={10} />
                <MyInput value={kirim.jumlah} label="Jumlah Barang" placeholder="Masukan jumlah barang" keyboardType="number-pad" iconname="apps" onChangeText={x => setKirim({ ...kirim, jumlah: x })} />
                <MyGap jarak={10} />
                <View style={{
                    flexDirection: 'row',
                    marginVertical: 10,
                }}>
                    <View style={{
                        flex: 1,
                        paddingRight: 5,
                    }}>
                        <MyButton onPress={() => {
                            setKirim({
                                ...kirim,
                                status: 'PENDING'
                            })
                        }} title="PENDING" warna={kirim.status == 'PENDING' ? colors.primary : colors.white} colorText={kirim.status == 'PENDING' ? colors.white : colors.primary} borderSize={1} borderColor={colors.primary} />
                    </View>
                    <View style={{
                        flex: 1,
                        paddingLeft: 5,

                    }}>
                        <MyButton onPress={() => {
                            setKirim({
                                ...kirim,
                                status: 'FINISH'
                            })
                        }} title="FINISH" warna={kirim.status == 'FINISH' ? colors.primary : colors.white} colorText={kirim.status == 'FINISH' ? colors.white : colors.primary} borderSize={1} borderColor={colors.primary} />
                    </View>
                </View>
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