import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleCheck as CheckCircle, Clock, TriangleAlert as AlertTriangle, User } from 'lucide-react-native';

export default function InsightsScreen() {
  const insights = [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
      title: 'Corn Crop Health Analysis',
      expert: 'Dr. Sarah Johnson',
      expertImage: 'https://images.pexels.com/photos/5876695/pexels-photo-5876695.jpeg',
      status: 'completed',
      timestamp: '2 hours ago',
      diagnosis: 'Nitrogen Deficiency',
      severity: 'moderate',
      recommendation: 'Apply nitrogen-rich fertilizer immediately. The yellowing in the lower leaves indicates nitrogen deficiency. Recommended dosage: 50kg/acre of urea fertilizer.',
      tips: [
        'Monitor soil moisture levels',
        'Apply fertilizer during cool morning hours',
        'Water thoroughly after application',
      ],
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg',
      title: 'Wheat Field Disease Detection',
      expert: 'Dr. Michael Chen',
      expertImage: 'https://images.pexels.com/photos/6652956/pexels-photo-6652956.jpeg',
      status: 'pending',
      timestamp: '6 hours ago',
      diagnosis: null,
      severity: null,
      recommendation: null,
      tips: [],
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg',
      title: 'Tomato Plant Health Check',
      expert: 'Dr. Emily Rodriguez',
      expertImage: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg',
      status: 'completed',
      timestamp: '1 day ago',
      diagnosis: 'Healthy Growth',
      severity: 'none',
      recommendation: 'Your tomato plants are showing excellent health! Continue with current care routine. Consider adding organic compost for enhanced growth.',
      tips: [
        'Maintain regular watering schedule',
        'Prune lower branches for better air circulation',
        'Add mulch around base to retain moisture',
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color="#22C55E" />;
      case 'pending':
        return <Clock size={20} color="#F59E0B" />;
      default:
        return <AlertTriangle size={20} color="#EF4444" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Analysis Complete';
      case 'pending':
        return 'Under Review';
      default:
        return 'Needs Attention';
    }
  };

  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case 'high':
        return '#EF4444';
      case 'moderate':
        return '#F59E0B';
      case 'low':
        return '#22C55E';
      case 'none':
        return '#22C55E';
      default:
        return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Expert Insights</Text>
          <Text style={styles.subtitle}>Professional analysis and recommendations for your crops</Text>
        </View>

        {/* Insights List */}
        {insights.map((insight) => (
          <View key={insight.id} style={styles.insightCard}>
            <Image source={{ uri: insight.image }} style={styles.cropImage} />
            
            <View style={styles.insightContent}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <View style={styles.statusContainer}>
                  {getStatusIcon(insight.status)}
                  <Text style={styles.statusText}>{getStatusText(insight.status)}</Text>
                </View>
              </View>

              <View style={styles.expertInfo}>
                <Image source={{ uri: insight.expertImage }} style={styles.expertAvatar} />
                <View>
                  <Text style={styles.expertName}>{insight.expert}</Text>
                  <Text style={styles.timestamp}>{insight.timestamp}</Text>
                </View>
              </View>

              {insight.status === 'completed' && (
                <View style={styles.analysisContainer}>
                  <View style={styles.diagnosisContainer}>
                    <Text style={styles.diagnosisLabel}>Diagnosis:</Text>
                    <Text style={[styles.diagnosisText, { color: getSeverityColor(insight.severity) }]}>
                      {insight.diagnosis}
                    </Text>
                  </View>

                  <Text style={styles.recommendationTitle}>Recommendation:</Text>
                  <Text style={styles.recommendationText}>{insight.recommendation}</Text>

                  {insight.tips.length > 0 && (
                    <View style={styles.tipsContainer}>
                      <Text style={styles.tipsTitle}>Additional Tips:</Text>
                      {insight.tips.map((tip, index) => (
                        <Text key={index} style={styles.tipText}>• {tip}</Text>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {insight.status === 'pending' && (
                <View style={styles.pendingContainer}>
                  <Text style={styles.pendingText}>
                    Your image is being analyzed by our expert team. You will receive detailed insights soon.
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Call to Action */}
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Upload New Photo for Analysis</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cropImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E7EB',
  },
  insightContent: {
    padding: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  expertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  expertAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  expertName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  analysisContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  diagnosisContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  diagnosisLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },
  diagnosisText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  tipsContainer: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#15803D',
    marginBottom: 4,
    lineHeight: 20,
  },
  pendingContainer: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  pendingText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  ctaButton: {
    marginHorizontal: 20,
    backgroundColor: '#22C55E',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});