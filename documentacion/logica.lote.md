# Control de Lotes y Activación de Inventario

## Objetivo
Crear un sistema para gestionar los lotes de productos de manera eficiente, controlando el inventario y los precios de los productos de forma precisa. Los lotes serán inicialmente marcados como **"pendientes"** y solo se activarán cuando sea necesario, lo que permitirá ajustar el stock y el precio de los productos conforme a lo que establece el lote.

## Flujo de Trabajo

### 1. **Creación del Lote**

Cuando se realiza una compra de productos:
- Se generan lotes correspondientes para los productos comprados.
- Cada lote contiene:
  - **Cantidad**: Número de unidades compradas.
  - **Precio**: Precio unitario del lote.
  - **Fecha de Entrada**: Fecha de la compra del lote.
  - **Estado**: Inicialmente, el lote se crea con el estado **"Pendiente"**. Esto indica que el lote aún no ha sido activado y no afectará el stock ni el precio de los productos.

### 2. **Estados del Lote**

- **Pendiente**: El lote ha sido registrado pero aún no está en uso. No afecta el inventario ni el precio de los productos.
- **Activo**: El lote está disponible para ser utilizado. Al activarse, el stock del producto se incrementa y el precio del producto se actualiza con el precio definido en el lote.

### 3. **Activación del Lote**

- **Botón de Activación**: En la interfaz de usuario, se mostrará un botón para activar los lotes pendientes.
- Cuando se presiona el botón de activación, el lote pasa de estado **"Pendiente"** a **"Activo"**.

#### Efectos de la Activación:
- **Stock**: El stock del producto se actualiza sumando la cantidad del lote a la cantidad existente del producto.
- **Precio**: El precio del producto se actualiza con el precio especificado en el lote.
- El producto asociado pasa a tener un nuevo precio y stock, reflejando los datos del lote activado.

## Beneficios del Sistema

- **Control sobre Inventario**: Los lotes no afectan el stock ni el precio del producto hasta que se activan. Esto ayuda a evitar que el stock se actualice prematuramente.
- **Control de Precios**: Puedes gestionar el precio de los productos de forma dinámica. Si un lote tiene un precio diferente, solo se aplicará cuando el lote sea activado, lo que te permite tener un control más preciso sobre los cambios de precios.
- **Verificación de Lotes**: El estado **"Pendiente"** permite realizar una verificación antes de activar los lotes. Esto es útil en casos de inspección de calidad, revisión de la validez de los productos o cualquier otro control previo.
- **Flexibilidad**: Puedes tener lotes pendientes durante un tiempo y activarlos cuando sea conveniente, sin que afecten inmediatamente el inventario.

## Consideraciones Técnicas

- **Base de Datos**: Los lotes deben tener un campo para el estado (pendiente/activo), cantidad, precio y fecha de entrada. Al activarse el lote, se deben realizar las actualizaciones correspondientes al stock del producto y el precio.
- **Interfaz de Usuario**: Incluir un estado visual claro para los lotes pendientes y un botón de activación. Además, mostrar una lista de lotes activados y pendientes para un fácil seguimiento.
- **Control de Seguridad**: Los lotes solo deben ser activados por usuarios con permisos adecuados, lo que puede implicar agregar roles o controles de acceso específicos para la gestión de lotes.

## Posibles Extensiones Futuras

- **Historial de Activación de Lotes**: Registrar cuándo y quién activó cada lote, lo que podría ser útil para auditorías o análisis históricos.
- **Alertas y Notificaciones**: Implementar alertas cuando un lote está pendiente demasiado tiempo, o cuando el stock de un lote se está agotando.
- **Reportes**: Integrar reportes que muestren la relación entre lotes y productos activos, con el stock y los precios aplicados.

## Resumen

El sistema de lotes pendientes y activos proporciona un control preciso sobre el stock y el precio de los productos, permitiendo gestionar de forma eficiente las compras y cambios de inventario. La activación manual de lotes asegura que el proceso sea controlado y no impacte el inventario hasta que sea necesario. Además, se crea un flujo claro y estructurado que facilita la gestión de inventarios y precios en el sistema.
