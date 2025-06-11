
<template>
    <div class="flex w-full gap-5">
        <div class="flex-1">
            <h2 class="text-center font-semibold text-2xl mb-5">Agents</h2>
            <div class="agent-list">
                <div class="p-6 bg-gray-50">
                    <div class="max-w-7xl mx-auto">
                        <div class="bg-white rounded-lg shadow overflow-hidden">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mobile
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created At
                                        </th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="agent in agents" :key="agent.id" class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">
                                                {{ agent.firstName }} {{ agent.lastName }}
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">{{ agent.email }}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">{{ agent.mobileNumber }}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ formatDate(agent.createdAt) }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div class="flex gap-3">
                                                <button type="button"
                                                    class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                                                    @click="handleEdit(agent)">
                                                    View/Edit
                                                </button>
                                                <button type="button"
                                                    class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                                    @click="handleDelete(agent)">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div v-if="agents.length === 0" class="text-center py-12">
                                <div class="text-gray-500 text-lg">No agents found</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="agent-form flex-1">
            <h2 class="text-center font-semibold text-2xl mb-5  ">{{ isEditing ? 'Edit' : 'Create' }} Agent</h2>
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

                <div class="flex justify-end gap-3">
                    <button
                        type="button" class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                        @click="resetForm"    
                    >
                        Reset
                    </button>

                    <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none">
                        {{ isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
                    </button>
                </div>
            </form>

            <div v-if="isEditing && currentAgent" class="current-agent-info">
                <h2 class="text-center font-semibold text-2xl mb-5 ">Current Agent</h2>
                <div class="info-grid">
                    <div>
                        <span class="font-bold">Name:</span> {{ currentAgent.firstName }} {{ currentAgent.lastName }}
                    </div>
                    <div>
                        <span class="font-bold">Email:</span> {{ currentAgent.email }}
                    </div>
                    <div>
                        <span class="font-bold">Mobile:</span> {{ currentAgent.mobileNumber }}
                    </div>
                    <div><strong>Created:</strong> {{ formatDate(currentAgent.createdAt) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { useAgent } from '@/composables/useAgent';
import { Agent } from '@/types/agent';
import { ref, reactive, computed, watch, onMounted } from 'vue';
import AgentList from './AgentList.vue';

interface Props {
    agent?: Agent | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  success: [agent: Agent];
  error: [message: string];
}>();

const {
    currentAgent,
    clearCurrentAgent,
    isLoading,
    hasError,
    errorMessage,
    clearError,
    agents,
    createAgent,
    updateAgent,
    fetchAgents,
    deleteAgent,
    fetchAgent,
} = useAgent();

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

const isEditing = computed(() => !!currentAgent.value);

console.log('is Editing', isEditing)

const refreshAgents = async () => {
    try {
        await fetchAgents();
    } catch (error: any) {
        emit('error', error.message);
    }
}

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

    if (formData.firstName.trim().length === 0) {
        errors.firstName = 'First name is required';
        isValid = false;
    }

    if (formData.lastName.trim().length === 0) {
        errors.lastName = 'Last name is required';
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

const handleSubmit = async () => {
    if (!validateForm()) {
        return;
    }

    clearError();
    successMessage.value = '';

    try {
        let result: Agent;
        if (isEditing.value && currentAgent.value) {
            result = await updateAgent(currentAgent.value.id, formData);
            successMessage.value = 'Property agent updated successfully!';
        } else {
            result = await createAgent(formData);
            successMessage.value = 'Property agent created successfully!';
            resetForm();
        }

        emit('success', result);

        setTimeout(() => {
            successMessage.value = '';
        }, 3000);

        refreshAgents();
    } catch (error: any) {
        emit('error', error.message);
    }
}

const resetForm = () => {
    formData.firstName = '';
    formData.lastName = '';
    formData.email = '';
    formData.mobileNumber = '';

    clearCurrentAgent();

    Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = '';
    });

    clearError();
    successMessage.value = '';
};

const populateForm = (agent: Agent) => {
    formData.firstName = agent.firstName;
    formData.lastName = agent.lastName;
    formData.email = agent.email;
    formData.mobileNumber = agent.mobileNumber;
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const handleEdit = async (agent: Agent) => {
    try {
        await fetchAgent(agent.id);
        if (currentAgent.value) {
            populateForm(currentAgent.value);
        }
    } catch (error: any) {
        emit('error', error.message);
    }
};

const handleDelete = async (agent: Agent) => {
    try {
        await deleteAgent(agent.id);
    } catch (error: any) {
        emit('error', error.message);
    }
};

watch(() => currentAgent.value, (newAgent) => {
    if (newAgent) {
        populateForm(newAgent);
    } else {
        resetForm();
    }
}, { immediate: true });

onMounted(() => {
    if (currentAgent.value) {
        populateForm(currentAgent.value);
    }

    refreshAgents();
});
</script>

<style scoped>
.agent-form, .agent-list {
    margin: 0 auto;
    padding: 2rem;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
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
</style>