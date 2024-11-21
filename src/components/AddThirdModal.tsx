import React, { useState } from 'react';
import '../styles/AddThirdModal.css';

interface AddThirdModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (newThirdParty: {
        name: string;
        address: string;
        contact_name: string;
        contact_info: string;
        category: 'client' | 'vendor';
    }) => Promise<void>;
}

const AddThirdModal: React.FC<AddThirdModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [contact_name, setContactName] = useState('');
    const [contact_info, setContactInfo] = useState('');
    const [category, setCategory] = useState<'client' | 'vendor'>('client');
    const [error, setError] = useState<string | null>(null);

    const handleAdd = async () => {
        if (!name || !address || !category) {
            setError('Por favor, complete todos los campos obligatorios.');
            return;
        }
    
        try {
            // Intentar agregar el tercero
            await onAdd({ name, address, contact_name, contact_info, category });
            
            // Si se agrega correctamente, limpiar campos y cerrar el modal
            setName('');
            setAddress('');
            setContactName('');
            setContactInfo('');
            setCategory('client');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            // Manejar errores desde Axios o cualquier error relacionado con la API
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error); // Mostrar el mensaje de error de la API
            } else {
                setError('Error desconocido al agregar el tercero.');
            }
        }
    };
    
    
    

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Agregar Tercero</h2>
                <button className="close-modal" onClick={onClose}>
                    Cerrar
                </button>
                <div className="modal-content">
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                        <label>Nombre*</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Dirección*</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Nombre de Contacto</label>
                        <input
                            type="text"
                            value={contact_name}
                            onChange={(e) => setContactName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Número de Contacto</label>
                        <input
                            type="text"
                            value={contact_info}
                            onChange={(e) => setContactInfo(e.target.value)}
                            maxLength={10}
                        />
                    </div>
                    <div className="form-group">
                        <label>Categoría*</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as 'client' | 'vendor')}
                            required
                        >
                            <option value="client">Cliente</option>
                            <option value="vendor">Proveedor</option>
                        </select>
                    </div>
                    <button className="add-button" onClick={handleAdd}>
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddThirdModal;
