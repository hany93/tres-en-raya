import React, { useState, useEffect } from "react";
import { Button, Tooltip, Typography, message, Space } from 'antd';
import { UserOutlined, DoubleRightOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";

const Juego = () => {
    const router = useRouter();

    const posicionCentro = 4,
        posicionesEsquinas = [0, 2, 6, 8],
        posicionesEntreEsquinas = [1, 3, 5, 7],
        posicionesGanadoras = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ],
        tenedoresEsquinaEntreesquinasPosiciondefensaVerificaciones = [
            [0, 7, 6, 3, 8],
            [2, 7, 8, 5, 6],
            [2, 3, 0, 6, 1],
            [8, 3, 6, 0, 7],
            [6, 1, 0, 2, 3],
            [8, 1, 2, 0, 5],
            [0, 5, 2, 1, 8],
            [6, 5, 8, 2, 7]
        ],
        tenedoresEsquinaEsquinaVerificacionVerificacion = [
            [0, 8, 2, 6],
            [2, 6, 0, 8]
        ]

    const [jugadas, setJugadas] = useState(["", "", "", "", "", "", "", "", ""]);
    const [juegoTerminado, setJuegoTerminado] = useState(false);
    const [puntuacion, setPuntuacion] = useState(0);
    const [jugadorActualHook, setJugadorActualHook] = useState();
    const [tresPosicionesAlineadas, setTresPosicionesAlineadas] = useState([]);

    const guardarPuntuacion = (puntuacion) => {
        var jugadorActual = localStorage.getItem('jugadorActual')
        jugadorActual = JSON.parse(jugadorActual)

        var jugadorRanking =
        {
            'nombre': jugadorActual,
            'ranking': puntuacion,
            'partidas': 1
        }

        var objJugadorRanking = localStorage.getItem('objJugadorRanking')
        if (objJugadorRanking) {
            var existeJugador = false
            objJugadorRanking = JSON.parse(objJugadorRanking)

            objJugadorRanking.forEach(function (element, index) {
                if (element.nombre == jugadorActual) {
                    element.ranking = (element.ranking + puntuacion) / 2
                    element.partidas = element.partidas + 1
                    existeJugador = true
                }
            })

            if (!existeJugador) {
                objJugadorRanking.push(jugadorRanking)
            }

        } else {
            objJugadorRanking = [
                jugadorRanking
            ]
        }

        var objJugadorRanking = JSON.stringify(objJugadorRanking)
        localStorage.setItem('objJugadorRanking', objJugadorRanking)
    }

    const verificarSiJugadorGana = (jugadasAuxiliar, puntuacionactual) => {
        for (let i = 0; i < posicionesGanadoras.length; i++) {
            if (jugadasAuxiliar[posicionesGanadoras[i][0]] == 'x' && jugadasAuxiliar[posicionesGanadoras[i][1]] == 'x' && jugadasAuxiliar[posicionesGanadoras[i][2]] == 'x') {
                setJugadas(jugadasAuxiliar)
                setPuntuacion(puntuacionactual + 5)
                guardarPuntuacion(puntuacionactual + 5)
                setJuegoTerminado(true);
                setTresPosicionesAlineadas([posicionesGanadoras[i][0], posicionesGanadoras[i][1], posicionesGanadoras[i][2]])
                message.success('Felicidades, ganaste la partida y obtuviste una puntuación de 6 puntos', 5);
                return true;
            }
        }
        return false
    }

    const siPcTieneDosCerosAlineadosMarcarTercero = (jugadasAuxiliar, puntuacionactual) => {
        for (let i = 0; i < posicionesGanadoras.length; i++) {
            if (jugadasAuxiliar[posicionesGanadoras[i][0]] == '0' && jugadasAuxiliar[posicionesGanadoras[i][1]] == '0' && !jugadasAuxiliar[posicionesGanadoras[i][2]]) {
                return accionesSiGanaLaPC(jugadasAuxiliar, i, 2, puntuacionactual, [posicionesGanadoras[i][0], posicionesGanadoras[i][1], posicionesGanadoras[i][2]])
            }
            if (jugadasAuxiliar[posicionesGanadoras[i][1]] == '0' && jugadasAuxiliar[posicionesGanadoras[i][2]] == '0' && !jugadasAuxiliar[posicionesGanadoras[i][0]]) {
                return accionesSiGanaLaPC(jugadasAuxiliar, i, 0, puntuacionactual, [posicionesGanadoras[i][1], posicionesGanadoras[i][2], posicionesGanadoras[i][0]])
            }
            if (jugadasAuxiliar[posicionesGanadoras[i][2]] == '0' && jugadasAuxiliar[posicionesGanadoras[i][0]] == '0' && !jugadasAuxiliar[posicionesGanadoras[i][1]]) {
                return accionesSiGanaLaPC(jugadasAuxiliar, i, 1, puntuacionactual, [posicionesGanadoras[i][2], posicionesGanadoras[i][0], posicionesGanadoras[i][1]])
            }
        }
        return false
    }

    const accionesSiGanaLaPC = (jugadasAuxiliar, posicionGanadora, indiceposicionGanadora, puntuacionactual, posicionesAlineadas) => {
        jugadasAuxiliar[posicionesGanadoras[posicionGanadora][indiceposicionGanadora]] = '0'
        guardarPuntuacion(puntuacionactual)
        setJuegoTerminado(true)
        setTresPosicionesAlineadas(posicionesAlineadas)
        message.info('Perdiste la partida, pero obtuviste una puntuacion de ' + puntuacionactual + ' puntos', 5);
        return jugadasAuxiliar
    }

    const verificarSiDosXAlineadas = (jugadasAuxiliar, arregloDePosiciones) => {
        for (let i = 0; i < arregloDePosiciones.length; i++) {
            if (jugadasAuxiliar[arregloDePosiciones[i][0]] == 'x' && jugadasAuxiliar[arregloDePosiciones[i][1]] == 'x' && !jugadasAuxiliar[arregloDePosiciones[i][2]]) {
                jugadasAuxiliar[arregloDePosiciones[i][2]] = '0'
                return jugadasAuxiliar
            }
            if (jugadasAuxiliar[arregloDePosiciones[i][1]] == 'x' && jugadasAuxiliar[arregloDePosiciones[i][2]] == 'x' && !jugadasAuxiliar[arregloDePosiciones[i][0]]) {
                jugadasAuxiliar[arregloDePosiciones[i][0]] = '0'
                return jugadasAuxiliar
            }
            if (jugadasAuxiliar[arregloDePosiciones[i][2]] == 'x' && jugadasAuxiliar[arregloDePosiciones[i][0]] == 'x' && !jugadasAuxiliar[arregloDePosiciones[i][1]]) {
                jugadasAuxiliar[arregloDePosiciones[i][1]] = '0'
                return jugadasAuxiliar
            }
        }
        return false
    }

    const siTenedorEsquinaEntreEsquinaJugarPosicionDefensa = (jugadasAuxiliar, arregloDePosiciones) => {
        for (let i = 0; i < arregloDePosiciones.length; i++) {
            if (jugadasAuxiliar[arregloDePosiciones[i][0]] == 'x' && jugadasAuxiliar[arregloDePosiciones[i][1]] == 'x' && !jugadasAuxiliar[arregloDePosiciones[i][2]] && !jugadasAuxiliar[arregloDePosiciones[i][3]] && !jugadasAuxiliar[arregloDePosiciones[i][4]]) {
                jugadasAuxiliar[arregloDePosiciones[i][2]] = '0'
                return jugadasAuxiliar
            }
        }
        return false
    }

    const siTenedorEsquinaEsquinaJugarEntreEsquinas = (jugadasAuxiliar, arregloDePosiciones) => {
        if (arregloDePosiciones == tenedoresEsquinaEsquinaVerificacionVerificacion) {
            for (let i = 0; i < arregloDePosiciones.length; i++) {
                if ((jugadasAuxiliar[arregloDePosiciones[i][0]] == 'x' && jugadasAuxiliar[arregloDePosiciones[i][1]] == 'x') && (!jugadasAuxiliar[arregloDePosiciones[i][2]] || !jugadasAuxiliar[arregloDePosiciones[i][3]])) {
                    return ponerCeroEnPosicionEntreEsquinas(jugadasAuxiliar)
                }
            }
        }
    }

    const ponerCeroSiUnCeroYdosPosicionesVacias = (jugadasAuxiliar, arregloDePosiciones, posicionesEsquinas) => {
        for (let i = 0; i < arregloDePosiciones.length; i++) {
            if (jugadasAuxiliar[arregloDePosiciones[i][0]] == '0' && !jugadasAuxiliar[arregloDePosiciones[i][1]] && !jugadasAuxiliar[arregloDePosiciones[i][2]]) {
                if (verificarSiEsEsquina(posicionesEsquinas, arregloDePosiciones[i][1])) {
                    jugadasAuxiliar[arregloDePosiciones[i][1]] = '0'
                    return jugadasAuxiliar
                }
                if (verificarSiEsEsquina(posicionesEsquinas, arregloDePosiciones[i][2])) {
                    jugadasAuxiliar[arregloDePosiciones[i][2]] = '0'
                    return jugadasAuxiliar
                }
            }
            if (jugadasAuxiliar[arregloDePosiciones[i][1]] == '0' && !jugadasAuxiliar[arregloDePosiciones[i][2]] && !jugadasAuxiliar[arregloDePosiciones[i][0]]) {
                if (verificarSiEsEsquina(posicionesEsquinas, arregloDePosiciones[i][2])) {
                    jugadasAuxiliar[arregloDePosiciones[i][2]] = '0'
                    return jugadasAuxiliar
                }
                if (verificarSiEsEsquina(posicionesEsquinas, arregloDePosiciones[i][0])) {
                    jugadasAuxiliar[arregloDePosiciones[i][0]] = '0'
                    return jugadasAuxiliar
                }
            }
            if (jugadasAuxiliar[arregloDePosiciones[i][2]] == '0' && !jugadasAuxiliar[arregloDePosiciones[i][0]] && !jugadasAuxiliar[arregloDePosiciones[i][1]]) {
                if (verificarSiEsEsquina(posicionesEsquinas, arregloDePosiciones[i][0])) {
                    jugadasAuxiliar[arregloDePosiciones[i][0]] = '0'
                    return jugadasAuxiliar
                }
                if (verificarSiEsEsquina(posicionesEsquinas, arregloDePosiciones[i][1])) {
                    jugadasAuxiliar[arregloDePosiciones[i][1]] = '0'
                    return jugadasAuxiliar
                }
            }
        }
        return false
    }

    const verificarSiEsEsquina = (posicionesEsquinas, posicion) => {
        if (posicionesEsquinas.filter(i => (i === posicion)).length) {
            return true;
        } else {
            return false;
        }
    }

    const ponerCeroEnPosicionCentro = (jugadasAuxiliar) => {
        if (!jugadasAuxiliar[posicionCentro]) {
            jugadasAuxiliar[posicionCentro] = '0'
            return jugadasAuxiliar
        }
        return false
    }

    const ponerCeroEnEsquina = (jugadasAuxiliar) => {
        for (let i = 0; i < posicionesEsquinas.length; i++) {
            if (!jugadasAuxiliar[posicionesEsquinas[i]]) {
                jugadasAuxiliar[posicionesEsquinas[i]] = '0'
                return jugadasAuxiliar
            }
        }
        return false
    }

    const ponerCeroEnPosicionEntreEsquinas = (jugadasAuxiliar) => {
        for (let i = 0; i < posicionesEntreEsquinas.length; i++) {
            if (!jugadasAuxiliar[posicionesEntreEsquinas[i]]) {
                jugadasAuxiliar[posicionesEntreEsquinas[i]] = '0'
                return jugadasAuxiliar
            }
        }
        return false
    }

    const verificarSiNoSePuedenHacerMasJugadas = (jugadasAuxiliar, puntuacionactual) => {
        var casillasLlenas = true;
        for (let i = 0; i < jugadasAuxiliar.length; i++) {
            if (!jugadasAuxiliar[i]) {
                casillasLlenas = false
                break;
            }
        }
        if (casillasLlenas) {
            guardarPuntuacion(puntuacionactual)
            setJuegoTerminado(true);
            message.info('Hiciste tablas y obtuviste una puntuación de ' + puntuacionactual + ' puntos', 5);
        }
    }

    const onClickButton = (casilla) => {

        if (!juegoTerminado) {
            if (!jugadas[casilla]) {
                var jugadasAuxiliar = jugadas
                jugadasAuxiliar[casilla] = 'x'
                var puntuacionactual = puntuacion + 1
                setPuntuacion(puntuacionactual)

                if (verificarSiJugadorGana(jugadasAuxiliar, puntuacionactual)) {
                    return
                }

                var resultadoSiDosCeros = siPcTieneDosCerosAlineadosMarcarTercero(jugadasAuxiliar, puntuacionactual)
                if (resultadoSiDosCeros) {
                    jugadasAuxiliar = resultadoSiDosCeros
                    setJugadas(jugadasAuxiliar)
                    return
                }

                var resultadoSiDosX = verificarSiDosXAlineadas(jugadasAuxiliar, posicionesGanadoras)
                if (resultadoSiDosX) {
                    jugadasAuxiliar = resultadoSiDosX
                    setJugadas(jugadasAuxiliar)
                    puntuacionactual = puntuacionactual + 1
                    setPuntuacion(puntuacionactual)
                    verificarSiNoSePuedenHacerMasJugadas(jugadasAuxiliar, puntuacionactual)
                    return
                }

                var resultadoTenedorEsquinaEntreEsquinas = siTenedorEsquinaEntreEsquinaJugarPosicionDefensa(jugadasAuxiliar, tenedoresEsquinaEntreesquinasPosiciondefensaVerificaciones)
                if (resultadoTenedorEsquinaEntreEsquinas) {
                    jugadasAuxiliar = resultadoTenedorEsquinaEntreEsquinas
                    setJugadas(jugadasAuxiliar)
                    puntuacionactual = puntuacionactual + 3
                    setPuntuacion(puntuacionactual)
                    verificarSiNoSePuedenHacerMasJugadas(jugadasAuxiliar, puntuacionactual)
                    return
                }

                var resultadoTenedorEsquinaEsquina = siTenedorEsquinaEsquinaJugarEntreEsquinas(jugadasAuxiliar, tenedoresEsquinaEsquinaVerificacionVerificacion)
                if (resultadoTenedorEsquinaEsquina) {
                    jugadasAuxiliar = resultadoTenedorEsquinaEsquina
                    setJugadas(jugadasAuxiliar)
                    puntuacionactual = puntuacionactual + 3
                    setPuntuacion(puntuacionactual)
                    verificarSiNoSePuedenHacerMasJugadas(jugadasAuxiliar, puntuacionactual)
                    return
                }

                var resultadoUnCeroDosEnBlanco = ponerCeroSiUnCeroYdosPosicionesVacias(jugadasAuxiliar, posicionesGanadoras, posicionesEsquinas)
                if (resultadoUnCeroDosEnBlanco) {
                    jugadasAuxiliar = resultadoUnCeroDosEnBlanco
                    setJugadas(jugadasAuxiliar)
                    verificarSiNoSePuedenHacerMasJugadas(jugadasAuxiliar, puntuacionactual)
                    return
                }

                var resultadoPosicionCentro = ponerCeroEnPosicionCentro(jugadasAuxiliar)
                if (resultadoPosicionCentro) {
                    jugadasAuxiliar = resultadoPosicionCentro
                    setJugadas(jugadasAuxiliar)
                    verificarSiNoSePuedenHacerMasJugadas(jugadasAuxiliar, puntuacionactual)
                    return
                }

                var resultadoPosicionEsquina = ponerCeroEnEsquina(jugadasAuxiliar)
                if (resultadoPosicionEsquina) {
                    jugadasAuxiliar = resultadoPosicionEsquina
                    setJugadas(jugadasAuxiliar)
                    verificarSiNoSePuedenHacerMasJugadas(jugadasAuxiliar, puntuacionactual)
                    return
                }

                var resultadoPosicionEntreEsquinas = ponerCeroEnPosicionEntreEsquinas(jugadasAuxiliar)
                if (resultadoPosicionEntreEsquinas) {
                    jugadasAuxiliar = resultadoPosicionEntreEsquinas
                    setJugadas(jugadasAuxiliar)
                    verificarSiNoSePuedenHacerMasJugadas(jugadasAuxiliar, puntuacionactual)
                    return
                }
                setJugadas(jugadasAuxiliar)
                verificarSiNoSePuedenHacerMasJugadas(jugadasAuxiliar, puntuacionactual)
            }
        }
    }

    const irPuntuacion = () => {
        router.push("/puntuacion");
    }

    const irJuego = () => {
        setJugadas(["", "", "", "", "", "", "", "", ""])
        setJuegoTerminado(false)
        setPuntuacion(0)
        setTresPosicionesAlineadas([])
    }

    useEffect(() => {
        if (!jugadorActualHook) {
            var jugadorActual = localStorage.getItem('jugadorActual')
            jugadorActual = JSON.parse(jugadorActual)
            setJugadorActualHook(jugadorActual)
        }
    });

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 50 }}>
                <div style={{ color: 'greenyellow', fontWeight: 'bold', fontSize: 30 }}>
                    <UserOutlined style={{ marginTop: 8 }} /> Jugador {jugadorActualHook}
                </div>
                <div style={{ color: 'greenyellow', fontWeight: 'bold', fontSize: 30 }}>
                    <Space>
                        Puntuación
                        <div style={{ backgroundColor: 'greenyellow', fontWeight: 'bold', fontSize: 20, padding: 12, borderRadius: 5, color: '#1e2c33' }}>
                            {puntuacion}
                        </div>
                    </Space>
                </div>
            </div>
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: 'column',
                justifyContent: "space-around",
                gap: 12,
                width: '100%',
                alignItems: 'center',
                marginTop: 50
            }}>
                <div>
                    <div className="button-tablero">
                        <Button onClick={() => onClickButton(0)} style={{ borderColor: tresPosicionesAlineadas.indexOf(0) != -1 ? '#1e2c33' : 'greenyellow', backgroundColor: tresPosicionesAlineadas.indexOf(0) != -1 ? jugadas[0] === '0' ? 'orangered' : 'greenyellow' : '#1e2c33', color: jugadas[0] === '0' ? tresPosicionesAlineadas.indexOf(0) != -1 ? '#1e2c33' : 'orangered' : tresPosicionesAlineadas.indexOf(0) != -1 ? '#1e2c33' : 'greenyellow' }}>{jugadas[0] ? jugadas[0] : ' '}</Button>
                        <Button onClick={() => onClickButton(1)} style={{ borderColor: tresPosicionesAlineadas.indexOf(1) != -1 ? '#1e2c33' : 'greenyellow', backgroundColor: tresPosicionesAlineadas.indexOf(1) != -1 ? jugadas[1] === '0' ? 'orangered' : 'greenyellow' : '#1e2c33', color: jugadas[1] === '0' ? tresPosicionesAlineadas.indexOf(1) != -1 ? '#1e2c33' : 'orangered' : tresPosicionesAlineadas.indexOf(1) != -1 ? '#1e2c33' : 'greenyellow' }}>{jugadas[1] ? jugadas[1] : ' '}</Button>
                        <Button onClick={() => onClickButton(2)} style={{ borderColor: tresPosicionesAlineadas.indexOf(2) != -1 ? '#1e2c33' : 'greenyellow', backgroundColor: tresPosicionesAlineadas.indexOf(2) != -1 ? jugadas[2] === '0' ? 'orangered' : 'greenyellow' : '#1e2c33', color: jugadas[2] === '0' ? tresPosicionesAlineadas.indexOf(2) != -1 ? '#1e2c33' : 'orangered' : tresPosicionesAlineadas.indexOf(2) != -1 ? '#1e2c33' : 'greenyellow' }}>{jugadas[2] ? jugadas[2] : ' '}</Button>
                    </div>
                    <div className="button-tablero">
                        <Button onClick={() => onClickButton(3)} style={{ borderColor: tresPosicionesAlineadas.indexOf(3) != -1 ? '#1e2c33' : 'greenyellow', backgroundColor: tresPosicionesAlineadas.indexOf(3) != -1 ? jugadas[3] === '0' ? 'orangered' : 'greenyellow' : '#1e2c33', color: jugadas[3] === '0' ? tresPosicionesAlineadas.indexOf(3) != -1 ? '#1e2c33' : 'orangered' : tresPosicionesAlineadas.indexOf(3) != -1 ? '#1e2c33' : 'greenyellow' }}>{jugadas[3] ? jugadas[3] : ' '}</Button>
                        <Button onClick={() => onClickButton(4)} style={{ borderColor: tresPosicionesAlineadas.indexOf(4) != -1 ? '#1e2c33' : 'greenyellow', backgroundColor: tresPosicionesAlineadas.indexOf(4) != -1 ? jugadas[4] === '0' ? 'orangered' : 'greenyellow' : '#1e2c33', color: jugadas[4] === '0' ? tresPosicionesAlineadas.indexOf(4) != -1 ? '#1e2c33' : 'orangered' : tresPosicionesAlineadas.indexOf(4) != -1 ? '#1e2c33' : 'greenyellow' }}>{jugadas[4] ? jugadas[4] : ' '}</Button>
                        <Button onClick={() => onClickButton(5)} style={{ borderColor: tresPosicionesAlineadas.indexOf(5) != -1 ? '#1e2c33' : 'greenyellow', backgroundColor: tresPosicionesAlineadas.indexOf(5) != -1 ? jugadas[5] === '0' ? 'orangered' : 'greenyellow' : '#1e2c33', color: jugadas[5] === '0' ? tresPosicionesAlineadas.indexOf(5) != -1 ? '#1e2c33' : 'orangered' : tresPosicionesAlineadas.indexOf(5) != -1 ? '#1e2c33' : 'greenyellow' }}>{jugadas[5] ? jugadas[5] : ' '}</Button>
                    </div>
                    <div className="button-tablero">
                        <Button onClick={() => onClickButton(6)} style={{ borderColor: tresPosicionesAlineadas.indexOf(6) != -1 ? '#1e2c33' : 'greenyellow', backgroundColor: tresPosicionesAlineadas.indexOf(6) != -1 ? jugadas[6] === '0' ? 'orangered' : 'greenyellow' : '#1e2c33', color: jugadas[6] === '0' ? tresPosicionesAlineadas.indexOf(6) != -1 ? '#1e2c33' : 'orangered' : tresPosicionesAlineadas.indexOf(6) != -1 ? '#1e2c33' : 'greenyellow' }}>{jugadas[6] ? jugadas[6] : ' '}</Button>
                        <Button onClick={() => onClickButton(7)} style={{ borderColor: tresPosicionesAlineadas.indexOf(7) != -1 ? '#1e2c33' : 'greenyellow', backgroundColor: tresPosicionesAlineadas.indexOf(7) != -1 ? jugadas[7] === '0' ? 'orangered' : 'greenyellow' : '#1e2c33', color: jugadas[7] === '0' ? tresPosicionesAlineadas.indexOf(7) != -1 ? '#1e2c33' : 'orangered' : tresPosicionesAlineadas.indexOf(7) != -1 ? '#1e2c33' : 'greenyellow' }}>{jugadas[7] ? jugadas[7] : ' '}</Button>
                        <Button onClick={() => onClickButton(8)} style={{ borderColor: tresPosicionesAlineadas.indexOf(8) != -1 ? '#1e2c33' : 'greenyellow', backgroundColor: tresPosicionesAlineadas.indexOf(8) != -1 ? jugadas[8] === '0' ? 'orangered' : 'greenyellow' : '#1e2c33', color: jugadas[8] === '0' ? tresPosicionesAlineadas.indexOf(8) != -1 ? '#1e2c33' : 'orangered' : tresPosicionesAlineadas.indexOf(8) != -1 ? '#1e2c33' : 'greenyellow' }}>{jugadas[8] ? jugadas[8] : ' '}</Button>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 50 }} className="button-tablero-siguiente" >
                <Tooltip placement="right" color={juegoTerminado ? 'greenyellow' : 'orangered'} title={juegoTerminado ? <Typography.Title level={5} style={{ color: '#1e2c33' }}>Jugar otra partida</Typography.Title> : <Typography.Title level={5} style={{ color: '#1e2c33' }}>Debe terminar la partida</Typography.Title>}>
                    <Button onClick={() => irJuego()} shape='circle' icon={<ReloadOutlined style={{ fontSize: 20 }} />} disabled={juegoTerminado ? false : true} />
                </Tooltip>
                <Tooltip placement="right" color={juegoTerminado ? 'greenyellow' : 'orangered'} title={juegoTerminado ? <Typography.Title level={5} style={{ color: '#1e2c33' }}>Ir al Ranking</Typography.Title> : <Typography.Title level={5} style={{ color: '#1e2c33' }}>Debe terminar la partida</Typography.Title>}>
                    <Button onClick={() => irPuntuacion()} shape='circle' icon={<DoubleRightOutlined style={{ fontSize: 20 }} />} disabled={juegoTerminado ? false : true} />
                </Tooltip>
            </div>
        </>
    );
};

export default Juego;