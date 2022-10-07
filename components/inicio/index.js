import React, { useState, useEffect } from "react";
import { Typography, Input, Form, Button, AutoComplete } from 'antd';
import { UserOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";



const Inicio = () => {
    const router = useRouter();

    const [jugadoresAutocompletar, setJugadoresAutocompletar] = useState();

    const guardarJugadorYRedireccionarAJuego = (values) => {
        var jugadorActual = values.username
        jugadorActual = JSON.stringify(jugadorActual)
        localStorage.setItem('jugadorActual', jugadorActual)

        router.push("/juego");
    };

    const informarError = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const SortArray = (x, y) => {
        return x.value.localeCompare(y.value);
    }

    useEffect(() => {
        if (!jugadoresAutocompletar) {
            var objJugadorRanking = localStorage.getItem('objJugadorRanking')
            if (objJugadorRanking) {
                objJugadorRanking = JSON.parse(objJugadorRanking)
                objJugadorRanking.forEach(function (element, index) {
                    element['value'] = element['nombre'];
                    delete element.ranking
                    delete element.partidas
                    delete element.nombre
                })
                objJugadorRanking = objJugadorRanking.sort(SortArray);
            } else {
                objJugadorRanking = []
            }
            setJugadoresAutocompletar(objJugadorRanking)
        }
    });

    return (
        <>
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: 'column',
                justifyContent: "space-around",
                gap: 12,
                alignItems: 'center'
            }}>
                <Typography.Title level={1} style={{ marginTop: 200, textAlign: 'center' }}><span style={{ color: 'greenyellow' }}>Bienvenido al Juego</span><br /><span style={{ color: 'orangered' }}>TRES EN RAYA</span></Typography.Title>
                <Form
                    layout="vertical"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={guardarJugadorYRedireccionarAJuego}
                    onFinishFailed={informarError}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Por favor entre el nombre!',
                            },
                        ]}>
                        <AutoComplete
                            options={jugadoresAutocompletar}
                            filterOption={(inputValue, option) =>
                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                        >
                            <Input placeholder="Jugador" size="large" prefix={<UserOutlined style={{ fontSize: 35, color: '#1e2c33' }} />} />
                        </AutoComplete>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<DoubleRightOutlined style={{ fontSize: 20, color: '#1e2c33' }} />} size="large" block style={{ fontSize: 20, fontWeight: 'bold', borderColor: 'greenyellow', backgroundColor: 'greenyellow', color: '#1e2c33' }}>JUGAR</Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default Inicio;