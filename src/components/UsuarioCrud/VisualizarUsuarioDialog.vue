<template>
    <Dialog :visible="visible" :style="{ width: '600px', height: '500px' }" header="Visualizar Usuario" :modal="true" @update:visible="emit('update:visible', $event)">
        <!-- El tamaño del diálogo es fijo: 'width' controla el ancho y 'height' el alto. Puedes cambiar estos valores (en px) según necesites. -->
        <Tabs value="0">
            <TabList class="justify-center">
                <Tab value="0">Datos Personales</Tab>
                <Tab value="1">Datos de Usuario</Tab>
                <Tab value="2">Horarios</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0"><Cont_Visualizar_Fase1 :usuario="usuario" /></TabPanel>
                <TabPanel value="1"><Cont_Visualizar_Fase2 :usuario="usuario" /></TabPanel>
                <TabPanel value="2"><Cont_Visualizar_Fase3 :usuario="usuario" /></TabPanel>
            </TabPanels>
        </Tabs>
    </Dialog>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';
import Cont_Visualizar_Fase1 from './Cont_Visualizar/Cont_Visualizar_Fase1.vue';
import Cont_Visualizar_Fase2 from './Cont_Visualizar/Cont_Visualizar_Fase2.vue';
import Cont_Visualizar_Fase3 from './Cont_Visualizar/Cont_Visualizar_Fase3.vue';

const props = defineProps(['visible', 'usuario']);
const emit = defineEmits(['update:visible']);
</script>