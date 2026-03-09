class ChatInterface {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.useGroqCheckbox = document.getElementById('useGroq');
        this.charCount = document.getElementById('charCount');
        this.modelStatus = document.getElementById('modelStatus');
        this.errorToast = document.getElementById('errorToast');
        this.errorMessage = document.getElementById('errorMessage');
        
        this.isTyping = false;
        this.apiBaseUrl = 'http://localhost:8000';
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.messageInput.addEventListener('input', () => {
            this.updateCharCount();
            this.toggleSendButton();
            this.autoResize();
        });
        
        // Quick action buttons
        document.querySelectorAll('.quick-action').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // Check model status on load
        this.checkModelStatus();
        
        // Focus input
        this.messageInput.focus();
    }
    
    async checkModelStatus() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/models/status`);
            const status = await response.json();
            
            if (status.text_generation === 'connected' && status.image_generation === 'ready') {
                this.modelStatus.textContent = 'All models ready';
                this.modelStatus.className = 'status-badge ready';
            } else {
                this.modelStatus.textContent = 'Some models unavailable';
                this.modelStatus.className = 'status-badge error';
            }
            
            // Show Groq availability
            if (status.groq_available) {
                this.useGroqCheckbox.disabled = false;
                this.useGroqCheckbox.parentElement.style.opacity = '1';
            } else {
                this.useGroqCheckbox.disabled = true;
                this.useGroqCheckbox.checked = false;
                this.useGroqCheckbox.parentElement.style.opacity = '0.5';
            }
            
        } catch (error) {
            console.error('Error checking model status:', error);
            this.modelStatus.textContent = 'Backend unavailable';
            this.modelStatus.className = 'status-badge error';
        }
    }
    
    handleQuickAction(action) {
        const prompts = {
            'brand-name': 'I need a brand name for a tech startup',
            'logo': 'Create a logo for my brand',
            'tagline': 'Generate a catchy tagline for my business',
            'marketing': 'Write a marketing caption for social media'
        };
        
        if (prompts[action]) {
            this.messageInput.value = prompts[action];
            this.updateCharCount();
            this.toggleSendButton();
            this.messageInput.focus();
        }
    }
    
    updateCharCount() {
        const length = this.messageInput.value.length;
        this.charCount.textContent = `${length}/1000`;
        
        if (length > 900) {
            this.charCount.style.color = '#ef4444';
        } else if (length > 700) {
            this.charCount.style.color = '#f59e0b';
        } else {
            this.charCount.style.color = '#9ca3af';
        }
    }
    
    toggleSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText || this.isTyping;
    }
    
    autoResize() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.updateCharCount();
        this.toggleSendButton();
        this.autoResize();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    use_groq: this.useGroqCheckbox.checked
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add assistant response
            if (data.type === 'image') {
                this.addMessage(data.response, 'assistant', data.image_url);
            } else {
                this.addMessage(data.response, 'assistant');
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            this.showError('Failed to send message. Please check if the backend server is running.');
        }
    }
    
    addMessage(content, sender, imageUrl = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (imageUrl) {
            const textElement = document.createElement('p');
            textElement.textContent = content;
            messageContent.appendChild(textElement);
            
            const image = document.createElement('img');
            image.src = this.apiBaseUrl + imageUrl;
            image.alt = 'Generated logo/brand image';
            image.onload = () => {
                // Scroll to bottom when image loads
                this.scrollToBottom();
            };
            messageContent.appendChild(image);
        } else {
            // Parse and render markdown-like content
            const parsedContent = this.parseContent(content);
            messageContent.innerHTML = parsedContent;
        }
        
        const timeElement = document.createElement('div');
        timeElement.className = 'message-time';
        timeElement.textContent = this.getCurrentTime();
        
        messageContent.appendChild(timeElement);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    parseContent(content) {
        // Simple parsing for basic formatting
        let parsed = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        
        // Wrap in paragraphs if not already
        if (!parsed.startsWith('<p>')) {
            parsed = '<p>' + parsed + '</p>';
        }
        
        // Convert numbered lists
        parsed = parsed.replace(/(\d+\.\s)/g, '<li>$1').replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');
        
        return parsed;
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.style.display = 'block';
        this.toggleSendButton();
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.style.display = 'none';
        this.toggleSendButton();
    }
    
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorToast.style.display = 'flex';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }
    
    hideError() {
        this.errorToast.style.display = 'none';
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }
}

// Initialize chat interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chat = new ChatInterface();
    
    // Auto-enable Groq for better performance
    const groqCheckbox = document.getElementById('useGroq');
    if (groqCheckbox && !groqCheckbox.disabled) {
        groqCheckbox.checked = true;
        chat.updateCharCount();
        chat.toggleSendButton();
    }
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// Handle connection errors
window.addEventListener('online', () => {
    console.log('Connection restored');
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
    // Show offline message
    const errorToast = document.getElementById('errorToast');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = 'Connection lost. Please check your internet connection.';
    errorToast.style.display = 'flex';
});
