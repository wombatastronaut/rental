
<template>
    <div class="agent-form w-full">
        <div class="form-header">
            <h2>{{ isEditing ? 'Edit' : 'Create' }} Agent</h2>
        </div>
        <form @submit.prevent="handleSubmit" class="form" novalidate>
            <div class="form-group">
                <label for="firstName" class="label">First Name *</label>
                <input id="firstName" v-model="formData.firstName" type="text" class="input"
                    :class="{ 'input-error': errors.firstName }" placeholder="Enter first name" required />
                <span v-if="errors.firstName" class="error-text">{{ errors.firstName }}</span>
            </div>

            <div class="form-group">
                <label for="lastName" class="label">Last Name *</label>
                <input id="lastName" v-model="formData.lastName" type="text" class="input"
                    :class="{ 'input-error': errors.lastName }" placeholder="Enter last name" required />
                <span v-if="errors.lastName" class="error-text">{{ errors.lastName }}</span>
            </div>

            <div class="form-group">
                <label for="email" class="label">Email *</label>
                <input id="email" v-model="formData.email" type="email" class="input"
                    :class="{ 'input-error': errors.email }" placeholder="Enter email address" required />
                <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
            </div>

            <div class="form-group">
                <label for="mobileNumber" class="label">Mobile Number *</label>
                <input id="mobileNumber" v-model="formData.mobileNumber" type="tel" class="input"
                    :class="{ 'input-error': errors.mobileNumber }" placeholder="Enter mobile number" required />
                <span v-if="errors.mobileNumber" class="error-text">{{ errors.mobileNumber }}</span>
            </div>

            <div v-if="hasError" class="error-message">
                {{ errorMessage }}
            </div>

            <div v-if="successMessage" class="success-message">
                {{ successMessage }}
            </div>

            <div class="form-actions">
                <button type="button" @click="resetForm" class="btn btn-secondary" :disabled="isLoading">
                    Reset
                </button>
                <button type="submit" class="btn btn-primary">
                    {{ isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
                </button>
            </div>
        </form>
    </div>
</template>
  
<script setup lang="ts">
import { PropertyAgent } from '@/types/propertyAgent';
import { ref, reactive, computed, watch, onMounted } from 'vue';

interface Props {
    agent?: PropertyAgent | null;
}

const props = defineProps<Props>();

const isLoading = false;
const hasError = false;
const errorMessage = '';

// const {
//     isLoading,
//     hasError,
//     errorMessage,
//     clearError,
//     createAgent,
//     updateAgent
// } = usePropertyAgent();

const formData = reactive({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: ''
});

const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: ''
});

const successMessage = ref('');

const isEditing = computed(() => !!props.agent);

const isFormValid = computed(() => {
    return formData.firstName.trim().length >= 2 &&
        formData.lastName.trim().length >= 2 &&
        validateEmail(formData.email) &&
        validateMobileNumber(formData.mobileNumber);
});

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateMobileNumber = (mobile: string): boolean => {
    const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return mobileRegex.test(mobile.replace(/[\s\-\(\)]/g, ''));
};

const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = '';
    });

    if (formData.firstName.trim().length < 2) {
        errors.firstName = 'First name must be at least 2 characters long';
        isValid = false;
    }

    if (formData.lastName.trim().length < 2) {
        errors.lastName = 'Last name must be at least 2 characters long';
        isValid = false;
    }

    if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }

    if (!validateMobileNumber(formData.mobileNumber)) {
        errors.mobileNumber = 'Please enter a valid mobile number';
        isValid = false;
    }

    return isValid;
};

const handleSubmit = () => {
    console.log('test')
    if (!validateForm()) {
        return;
    }

    //   clearError();
    successMessage.value = '';
}

const resetForm = () => {
    if (isEditing.value && props.agent) {
        populateForm(props.agent);
    } else {
        formData.firstName = '';
        formData.lastName = '';
        formData.email = '';
        formData.mobileNumber = '';
    }

    Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = '';
    });

    //   clearError();
    successMessage.value = '';
};

const populateForm = (agent) => {
    formData.firstName = agent.firstName;
    formData.lastName = agent.lastName;
    formData.email = agent.email;
    formData.mobileNumber = agent.mobileNumber;
};
</script>

<style scoped>
.agent-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.form-header {
    margin-bottom: 2rem;
    text-align: center;
}

.form-header h2 {
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.label {
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
}

.input {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-error {
    border-color: #ef4444;
}

.input-error:focus {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-text {
    color: #ef4444;
    font-size: 0.875rem;
}

.error-message {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
}

.success-message {
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
    padding: 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, opacity 0.2s;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-primary {
    background-color: #3b82f6;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background-color: #2563eb;
}

.btn-secondary {
    background-color: #6b7280;
    color: white;
}

.btn-secondary:hover:not(:disabled) {
    background-color: #4b5563;
}

.current-agent-info {
    margin-top: 2rem;
    padding: 1.5rem;
    background-color: #f9fafb;
    border-radius: 6px;
}

.current-agent-info h3 {
    margin: 0 0 1rem 0;
    color: #1f2937;
    font-size: 1.125rem;
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    font-size: 0.875rem;
}

.info-grid div {
    color: #4b5563;
}

@media (max-width: 640px) {
    .agent-form {
        padding: 1rem;
        margin: 1rem;
    }

    .form-actions {
        flex-direction: column;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }
}
</style>