#!/bin/bash

# Array of titles
titles=(
  "Understanding Machine Learning Fundamentals"
  "The Future of Web Development"
  "Building Scalable Microservices"
  "Introduction to Quantum Computing"
  "Best Practices for DevOps"
  "Exploring the Deep Ocean Mysteries"
  "The Art of Wildlife Photography"
  "Ancient Civilizations of Mesopotamia"
  "Climate Change and Its Impact"
  "The Evolution of Programming Languages"
  "Cryptocurrency and Blockchain Technology"
  "The Science Behind Coffee Brewing"
  "Modern Architecture Design Principles"
  "The Psychology of Decision Making"
  "Exploring Mars: The Red Planet"
  "Mastering Docker and Kubernetes"
  "The History of the Internet"
  "Artificial Intelligence in Healthcare"
  "The Wonders of Bioluminescence"
  "Building Your First Mobile App"
  "The Renaissance Art Movement"
  "Understanding Neural Networks"
  "The Physics of Black Holes"
  "Sustainable Energy Solutions"
  "The Philosophy of Existentialism"
  "Cloud Computing Architecture"
  "The Mystery of Dark Matter"
  "Modern Database Design Patterns"
  "The Golden Age of Exploration"
  "Cybersecurity Best Practices"
  "The Science of Human Memory"
  "Revolutionary Discoveries in Medicine"
  "The Future of Electric Vehicles"
  "Understanding Genetic Engineering"
  "The Art of Japanese Gardens"
  "Building Distributed Systems"
  "The History of Ancient Egypt"
  "Machine Learning Algorithms Explained"
  "The Beauty of Fractal Geometry"
  "Exploring the Amazon Rainforest"
  "The Rise of Virtual Reality"
  "Understanding Quantum Mechanics"
  "The World of Particle Physics"
  "Building Serverless Applications"
  "The Mysteries of the Universe"
  "The Evolution of Music Technology"
  "Understanding Climate Systems"
  "The Art of Data Visualization"
  "Exploring Antarctic Wilderness"
  "The Future of Space Exploration"
)

# Array of descriptions
descriptions=(
  "Explore the fascinating world of this incredible topic and discover amazing insights."
  "A comprehensive guide to understanding the fundamentals and advanced concepts."
  "Dive deep into the subject matter with detailed analysis and practical examples."
  "Discover the latest trends, research findings, and expert perspectives."
  "Learn about the cutting-edge developments and future implications."
  "An in-depth exploration of theories, applications, and real-world scenarios."
  "Uncover the secrets and hidden aspects of this fascinating domain."
  "A detailed examination of key principles and methodologies."
  "Journey through the most important aspects and breakthrough discoveries."
  "Understanding the core concepts and their practical applications."
)

# Array of tags
tags_options=(
  "technology,programming,tutorial"
  "science,research,discovery"
  "nature,environment,wildlife"
  "history,culture,civilization"
  "art,design,creativity"
  "space,astronomy,exploration"
  "development,coding,software"
  "physics,mathematics,theory"
  "medicine,health,innovation"
  "future,trends,predictions"
)

# Create 50 posts
for i in {1..50}; do
  # Calculate date (going backwards from today)
  days_ago=$((i * 3))
  date=$(date -d "$days_ago days ago" +%Y-%m-%d)
  year=$(date -d "$days_ago days ago" +%Y)
  filename=$(date -d "$days_ago days ago" +%m-%d)__post-${i}.md
  
  # Select random title, description, and tags
  title="${titles[$((i % ${#titles[@]}))]}"
  description="${descriptions[$((i % ${#descriptions[@]}))]}"
  tags="${tags_options[$((i % ${#tags_options[@]}))]}"
  
  # Add feature tag to some posts
  if [ $((i % 10)) -eq 0 ]; then
    tags="${tags},feature"
  fi
  
  # Create year directory if it doesn't exist
  mkdir -p "$year"
  
  # Create the blog post
  cat > "${year}/${filename}" << POSTEOF
---
title: "${title}"
date: ${date}T10:00:00+01:00
draft: false
description: "${description}"
tags: [${tags}]
---

# ${title}

${description}

## Introduction

This is an auto-generated blog post created to test the infinite scroll functionality. The content explores various aspects of the topic with detailed analysis and insights.

## Key Points

- **Important Concept 1**: Understanding the fundamental principles
- **Important Concept 2**: Practical applications and real-world examples
- **Important Concept 3**: Future trends and developments
- **Important Concept 4**: Best practices and recommendations

## Detailed Analysis

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Section 1

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Section 2

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

## Conclusion

This topic represents an important area of study and practice. As we continue to explore and understand these concepts, new opportunities and challenges will emerge.

---

*This is a test post generated for infinite scroll demonstration.*
POSTEOF

  echo "Created post $i: ${year}/${filename}"
done

echo "All 50 posts created successfully!"
