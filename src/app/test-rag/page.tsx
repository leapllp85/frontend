'use client';

import React, { useState } from 'react';
import { Box, VStack, Button, Text, Heading } from '@chakra-ui/react';
import { AIResponse } from '../../components/common/AIResponse';
import { RAGApiResponse } from '../../types/ragApi';

// Mock RAG response for testing
const mockRAGResponse: RAGApiResponse = {
  success: true,
  analysis: {
    query_intent: "Show employee performance metrics by department",
    data_requirements: ["employee_count", "department", "performance_score"],
    recommended_component: "chart",
    component_config: {
      type: "bar_chart",
      title: "Employee Performance by Department",
      description: "Average performance scores across different departments",
      properties: {
        x_axis: "department",
        y_axis: "avg_performance",
        aggregation: "avg",
        filters: ["department", "quarter"]
      }
    }
  },
  queries: [
    {
      description: "Get average performance by department",
      sql: "SELECT department, AVG(performance_score) as avg_performance FROM employees GROUP BY department",
      orm: "Employee.objects.values('department').annotate(avg_performance=Avg('performance_score'))",
      expected_fields: ["department", "avg_performance"]
    }
  ],
  dataset: [
    {
      description: "Employee performance data by department",
      columns: ["department", "avg_performance", "employee_count"],
      data: [
        { department: "Engineering", avg_performance: 4.2, employee_count: 25 },
        { department: "Marketing", avg_performance: 3.8, employee_count: 12 },
        { department: "Sales", avg_performance: 4.0, employee_count: 18 },
        { department: "HR", avg_performance: 3.9, employee_count: 8 },
        { department: "Finance", avg_performance: 4.1, employee_count: 10 }
      ],
      row_count: 5
    }
  ],
  insights: {
    key_findings: [
      "Engineering department has the highest average performance score at 4.2",
      "Marketing department has the lowest performance score at 3.8",
      "Total of 73 employees across all departments"
    ],
    recommendations: [
      "Investigate factors contributing to Engineering's high performance",
      "Provide additional training and support to Marketing team",
      "Consider cross-department knowledge sharing sessions"
    ],
    next_steps: [
      "Schedule one-on-one meetings with Marketing team members",
      "Analyze specific performance metrics for each department",
      "Implement mentorship program between high and low performing teams"
    ]
  }
};

const mockTableResponse: RAGApiResponse = {
  success: true,
  analysis: {
    query_intent: "Show detailed employee information",
    data_requirements: ["employee_name", "department", "performance_score", "hire_date"],
    recommended_component: "table",
    component_config: {
      type: "data_table",
      title: "Employee Directory",
      description: "Complete list of employees with performance data",
      properties: {
        filters: ["department", "performance_range"]
      }
    }
  },
  dataset: [
    {
      description: "Employee directory with performance data",
      columns: ["employee_name", "department", "performance_score", "hire_date", "salary"],
      data: [
        { employee_name: "John Doe", department: "Engineering", performance_score: 4.5, hire_date: "2022-01-15", salary: 95000 },
        { employee_name: "Jane Smith", department: "Marketing", performance_score: 3.8, hire_date: "2021-06-10", salary: 75000 },
        { employee_name: "Mike Johnson", department: "Sales", performance_score: 4.2, hire_date: "2022-03-20", salary: 80000 },
        { employee_name: "Sarah Wilson", department: "HR", performance_score: 4.0, hire_date: "2021-11-05", salary: 70000 },
        { employee_name: "David Brown", department: "Finance", performance_score: 4.3, hire_date: "2022-02-28", salary: 85000 },
        { employee_name: "Lisa Davis", department: "Engineering", performance_score: 4.1, hire_date: "2021-09-12", salary: 92000 },
        { employee_name: "Tom Anderson", department: "Marketing", performance_score: 3.6, hire_date: "2022-05-18", salary: 72000 },
        { employee_name: "Emma Taylor", department: "Sales", performance_score: 3.9, hire_date: "2021-12-03", salary: 78000 }
      ],
      row_count: 8
    }
  ],
  insights: {
    key_findings: [
      "Average performance score across all employees is 4.05",
      "Engineering department has 2 employees in the dataset",
      "Most recent hire was Tom Anderson in May 2022"
    ],
    recommendations: [
      "Consider performance-based salary adjustments",
      "Implement regular performance review cycles",
      "Track correlation between hire date and performance"
    ],
    next_steps: [
      "Schedule quarterly performance reviews",
      "Analyze salary vs performance correlation",
      "Create employee development plans"
    ]
  }
};

const mockMetricResponse: RAGApiResponse = {
  success: true,
  analysis: {
    query_intent: "Show total employee count metric",
    data_requirements: ["total_employees"],
    recommended_component: "metric",
    component_config: {
      type: "metric_card",
      title: "Total Employees",
      description: "Current active employee count",
      properties: {
        aggregation: "count"
      }
    }
  },
  dataset: [
    {
      description: "Employee count data",
      columns: ["total_count", "active_count", "new_hires_this_month"],
      data: [
        { total_count: 73, active_count: 71, new_hires_this_month: 3 }
      ],
      row_count: 1
    }
  ],
  insights: {
    key_findings: [
      "Company has 73 total employees",
      "71 employees are currently active",
      "3 new hires joined this month"
    ],
    recommendations: [
      "Continue steady hiring pace",
      "Monitor employee retention rates",
      "Plan onboarding for new hires"
    ],
    next_steps: [
      "Review hiring pipeline",
      "Update employee handbook",
      "Schedule new hire orientations"
    ]
  }
};

export default function TestRAGPage() {
  const [currentResponse, setCurrentResponse] = useState<RAGApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testResponses = [
    { name: "Bar Chart", response: mockRAGResponse },
    { name: "Data Table", response: mockTableResponse },
    { name: "Metric Card", response: mockMetricResponse }
  ];

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <VStack gap={6} maxW="6xl" mx="auto">
        <VStack gap={4} textAlign="center">
          <Heading size="2xl" color="gray.800">
            RAG Integration Test
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Test the new RAG API response structure with different component types
          </Text>
        </VStack>

        <VStack gap={4}>
          <Text fontWeight="semibold" color="gray.700">
            Test Different Component Types:
          </Text>
          <Box display="flex" gap={4} flexWrap="wrap" justifyContent="center">
            {testResponses.map((test, index) => (
              <Button
                key={index}
                colorScheme="blue"
                variant="outline"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setCurrentResponse(test.response);
                    setIsLoading(false);
                  }, 1000);
                }}
                disabled={isLoading}
              >
                {test.name}
              </Button>
            ))}
            <Button
              colorScheme="red"
              variant="outline"
              onClick={() => setCurrentResponse(null)}
            >
              Clear
            </Button>
          </Box>
        </VStack>

        <Box w="full">
          <AIResponse
            aiResponse={currentResponse || ''}
            isLoading={isLoading}
            error={null}
            userQuestion="Test query for RAG integration"
          />
        </Box>
      </VStack>
    </Box>
  );
}
