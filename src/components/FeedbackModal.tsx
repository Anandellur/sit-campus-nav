import React, { useState } from 'react';
import { X, Star, MessageSquare } from 'lucide-react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Save to local storage
        const feedback = {
            id: Date.now(),
            rating,
            comment,
            date: new Date().toISOString()
        };

        const existingFeedback = JSON.parse(localStorage.getItem('campus_nav_feedback') || '[]');
        localStorage.setItem('campus_nav_feedback', JSON.stringify([...existingFeedback, feedback]));

        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setRating(0);
            setComment('');
            onClose();
        }, 2000);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '16px',
                width: '90%',
                maxWidth: '400px',
                position: 'relative',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} color="#6b7280" />
                </button>

                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <h3 style={{ color: '#059669', marginBottom: '8px' }}>Thank You!</h3>
                        <p style={{ color: '#4b5563' }}>Your feedback helps us improve.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <MessageSquare size={24} color="#2563eb" />
                            Feedback
                        </h2>
                        <p style={{ color: '#6b7280', marginBottom: '20px' }}>Rate your experience with Campus Nav</p>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    <Star
                                        size={32}
                                        fill={star <= rating ? "#fbbf24" : "none"}
                                        color={star <= rating ? "#fbbf24" : "#d1d5db"}
                                    />
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us what you think..."
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                marginBottom: '20px',
                                fontFamily: 'inherit',
                                resize: 'vertical'
                            }}
                        />

                        <button
                            type="submit"
                            disabled={rating === 0}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: rating === 0 ? '#9ca3af' : '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: rating === 0 ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            Submit Feedback
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
