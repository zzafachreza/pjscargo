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
import 'moment/locale/id';
export default function SAdd({ navigation, route }) {

    const [loading, setLoading] = useState(false);

    const [kirim, setKirim] = useState({
        barcode: route.params.barcode,
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
                    // navigation.goBack();
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
            padding: 10,
        }}>


            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: windowWidth / 15,
                    textAlign: 'center',
                    marginBottom: 10,
                }}>{route.params.barcode}</Text>
                <MyPicker iconname="location" onValueChange={x => setKirim({ ...kirim, tujuan: x })} label="Tujuan" data={[
                    { label: '20/GR', value: '20/GR', },
                    { label: '21/BP', value: '21/BP', },
                    { label: '14/BA', value: '14/BA', },
                    { label: '15/SKP', value: '15/SKP', },
                    { label: 'OTO EXP', value: 'OTO EXP', },
                    { label: 'TPI', value: 'TPI', },
                    { label: 'TOKO BATAM', value: 'TOKO BATAM', },

                ]} />

                <MyGap jarak={10} />
                <MyPicker iconname="cube" onValueChange={x => setKirim({ ...kirim, jenis: x })} label="Jenis" data={[
                    { label: 'PART', value: 'PART', },
                    { label: 'OLI', value: 'OLI', },
                    { label: 'BATERAI', value: 'BATERAI', },

                ]} />
                <MyGap jarak={10} />
                <MyInput label="Jumlah Barang" placeholder="Masukan jumlah barang" keyboardType="number-pad" iconname="apps" onChangeText={x => setKirim({ ...kirim, jumlah: x })} />

            </ScrollView>

            <MyGap jarak={20} />
            {!loading && <MyButton onPress={sendServer} title="SIMPAN" warna={colors.primary} Icons="person-add" />}

            {loading && <ActivityIndicator size="large" color={colors.primary} />
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})