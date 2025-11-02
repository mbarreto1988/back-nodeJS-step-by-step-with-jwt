
export function validate(schema) {
  return (req, res, next) => {
    try {
      if (!schema || typeof schema.safeParse !== 'function') {
        console.error('⚠️ Schema inválido o undefined en validate()');
        return res.status(500).json({ message: 'Error interno: esquema inválido' });
      }

      const result = schema.safeParse(req.body);

      if (!result.success) {
        let issues = result.error.issues;

        // 🩹 Fix para versiones donde viene todo en error.message
        if (!issues && result.error.message) {
          try {
            issues = JSON.parse(result.error.message);
          } catch {
            issues = [];
          }
        }

        const errors = (issues || []).map(err => ({
          field: err.path?.join('.') ?? 'unknown',
          message: err.message ?? 'Error de validación'
        }));

        console.log('❌ Errores de validación:', errors);

        return res.status(400).json({ message: 'Datos inválidos', errors });
      }

      req.validatedBody = result.data;
      next();
    } catch (err) {
      console.error('💥 Error inesperado en validate():', err);
      res.status(500).json({ message: 'Error interno de validación' });
    }
  };
}