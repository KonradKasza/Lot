import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FooterBar from '../components/FooterBar';
import styles from './CustomerInfo.module.css';
import { getCustomerInfo, updateCustomerInfo } from '../services/mockcustomerInfoService';

function CustomerInfo() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        age: '',
        phone_number: '',
        id_number: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Check if user is logged in and fetch customer info
    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            navigate('/login');
            return;
        }

        fetchCustomerInfo(userEmail);
    }, [navigate]);

    const fetchCustomerInfo = async (email) => {
        try {
            const response = await getCustomerInfo(email);
            if (response.success) {
                setCustomer(response.customer);
                setFormData(response.customer);
                // Check if any fields are empty
                const hasEmptyFields = !response.customer.first_name || 
                    !response.customer.last_name || 
                    !response.customer.gender || 
                    !response.customer.age || 
                    !response.customer.phone_number || 
                    !response.customer.id_number;
                if (hasEmptyFields) {
                    setIsEditing(true);
                }
            }
        } catch (err) {
            console.error('Error fetching customer info:', err);
            setError(t('customerInfo.loadError'));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleEdit = () => {
        setIsEditing(true);
        setError('');
    };

    const handleCancel = () => {
        setFormData(customer);
        setIsEditing(false);
        setError('');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsSaving(true);

        const userEmail = localStorage.getItem('userEmail');
        
        try {
            const response = await updateCustomerInfo(userEmail, formData);
            if (response.success) {
                setCustomer(response.customer);
                setIsEditing(false);
                setSuccessMessage(t('customerInfo.updateSuccess'));
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(response.error || t('customerInfo.updateError'));
            }
        } catch (err) {
            console.error('Error updating customer info:', err);
            setError(t('customerInfo.updateError'));
        } finally {
            setIsSaving(false);
        }
    };

    if (!customer) {
        return (
            <>
                <div className={styles.pageContainer}>
                    <div className={styles.container}>
                        <p>{t('customerInfo.loading')}</p>
                    </div>
                </div>
                <FooterBar />
            </>
        );
    }

    return (
        <>
            <div className={styles.pageContainer}>
                <div className={styles.container}>
                    <h1>{t('customerInfo.title')}</h1>
                    <p className={styles.subtitle}>{t('customerInfo.subtitle')}</p>

                    {error && <div className={styles.errorMessage}>{error}</div>}
                    {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

                    {isEditing ? (
                        <form onSubmit={handleSave} className={styles.form}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="first_name">{t('customerInfo.firstName')}</label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={t('customerInfo.firstNamePlaceholder')}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="last_name">{t('customerInfo.lastName')}</label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={t('customerInfo.lastNamePlaceholder')}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="gender">{t('customerInfo.gender')}</label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">{t('customerInfo.selectGender')}</option>
                                        <option value="Male">{t('customerInfo.male')}</option>
                                        <option value="Female">{t('customerInfo.female')}</option>
                                        <option value="Other">{t('customerInfo.other')}</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="age">{t('customerInfo.age')}</label>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        required
                                        min="1"
                                        max="150"
                                        placeholder={t('customerInfo.agePlaceholder')}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="phone_number">{t('customerInfo.phoneNumber')}</label>
                                    <input
                                        type="tel"
                                        id="phone_number"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={t('customerInfo.phoneNumberPlaceholder')}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="id_number">{t('customerInfo.idNumber')}</label>
                                    <input
                                        type="text"
                                        id="id_number"
                                        name="id_number"
                                        value={formData.id_number}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={t('customerInfo.idNumberPlaceholder')}
                                    />
                                </div>
                            </div>

                            <div className={styles.formActions}>
                                <button 
                                    type="submit" 
                                    className={styles.saveButton}
                                    disabled={isSaving}
                                >
                                    {isSaving ? t('customerInfo.saving') : t('customerInfo.save')}
                                </button>
                                <button 
                                    type="button" 
                                    className={styles.cancelButton}
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                >
                                    {t('customerInfo.cancel')}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className={styles.infoDisplay}>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>{t('customerInfo.firstName')}:</span>
                                    <span className={styles.value}>{customer.first_name}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>{t('customerInfo.lastName')}:</span>
                                    <span className={styles.value}>{customer.last_name}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>{t('customerInfo.gender')}:</span>
                                    <span className={styles.value}>{customer.gender}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>{t('customerInfo.age')}:</span>
                                    <span className={styles.value}>{customer.age}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>{t('customerInfo.phoneNumber')}:</span>
                                    <span className={styles.value}>{customer.phone_number}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>{t('customerInfo.idNumber')}:</span>
                                    <span className={styles.value}>{customer.id_number}</span>
                                </div>
                            </div>

                            <div className={styles.buttonGroup}>
                                <button 
                                    className={styles.editButton}
                                    onClick={handleEdit}
                                >
                                    {t('customerInfo.edit')}
                                </button>
                            </div>
                        </div>
                    )}

                    <button 
                        className={styles.bookingsButton}
                        onClick={() => navigate('/bookings')}
                    >
                        {t('customerInfo.goToBookings')}
                    </button>
                </div>
            </div>
            <FooterBar />
        </>
    );
}

export default CustomerInfo;
