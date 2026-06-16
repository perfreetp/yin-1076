import React from 'react';
import { View, Text } from '@tarojs/components';
import type { TimelineNode } from '@/types/ivf';
import styles from './index.module.scss';

interface TimelineProps {
  nodes: TimelineNode[];
  showAll?: boolean;
}

const phaseColors: Record<string, string> = {
  initial: '#FF9EC2',
  examination: '#4A90D9',
  stimulation: '#FAAD14',
  retrieval: '#FF6B9D',
  transfer: '#52C41A',
  pregnancy: '#722ED1'
};

const Timeline: React.FC<TimelineProps> = ({ nodes, showAll = false }) => {
  const displayNodes = showAll ? nodes : nodes.filter(n => n.status !== 'upcoming' || n.isKeyNode);

  return (
    <View className={styles.timeline}>
      {displayNodes.map((node, index) => (
        <View 
          key={node.id} 
          className={`${styles.timelineItem} ${node.status === 'current' ? styles.current : ''}`}
        >
          <View className={styles.timelineLine}>
            {index < displayNodes.length - 1 && (
              <View 
                className={`${styles.line} ${node.status === 'completed' ? styles.lineCompleted : ''}`}
              />
            )}
          </View>
          
          <View className={styles.timelineDot}>
            <View 
              className={`${styles.dot} ${node.status === 'completed' ? styles.dotCompleted : ''} ${node.status === 'current' ? styles.dotCurrent : ''}`}
              style={{ 
                background: node.status === 'current' ? phaseColors[node.phase] : undefined,
                borderColor: node.status === 'upcoming' ? phaseColors[node.phase] : undefined
              }}
            >
              {node.status === 'completed' && <Text className={styles.dotCheck}>✓</Text>}
              {node.isKeyNode && node.status !== 'completed' && (
                <View className={styles.keyDot} style={{ background: phaseColors[node.phase] }} />
              )}
            </View>
          </View>
          
          <View className={styles.timelineContent}>
            <View className={styles.timelineHeader}>
              <Text className={styles.timelineDate}>{node.date}</Text>
              {node.isKeyNode && (
                <View 
                  className={styles.keyTag}
                  style={{ background: `${phaseColors[node.phase]}20`, color: phaseColors[node.phase] }}
                >
                  关键节点
                </View>
              )}
            </View>
            <Text className={styles.timelineTitle}>{node.title}</Text>
            <Text className={styles.timelineDesc}>{node.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default Timeline;
