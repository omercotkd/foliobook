import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/providers";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import i18n from "@/i18n";
import type { NewsArticle } from "@foliobook/shared-types";

interface NewsTabProps {
  articles: NewsArticle[];
}

export function NewsTab({ articles }: NewsTabProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingHorizontal: spacing.md, gap: spacing.sm },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {articles.map((article) => (
        <View
          key={article.id}
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderRadius: borderRadius.medium,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                color: colors.text.primary,
                fontFamily: typography.display.fontFamily,
              },
            ]}
          >
            {article.title}
          </Text>

          <View style={styles.metaRow}>
            <Text
              style={[
                styles.source,
                {
                  color: colors.text.secondary,
                  fontFamily: typography.body.fontFamily,
                },
              ]}
            >
              {article.source.toUpperCase()}
            </Text>
            <Text
              style={[
                styles.dot,
                { color: colors.text.disabled },
              ]}
            >
              {" \u2022 "}
            </Text>
            <Text
              style={[
                styles.timeAgo,
                {
                  color: colors.text.secondary,
                  fontFamily: typography.body.fontFamily,
                },
              ]}
            >
              {article.timeAgo}
            </Text>
          </View>

          <Text
            style={[
              styles.summary,
              {
                color: colors.text.secondary,
                fontFamily: typography.body.fontFamily,
                lineHeight: typography.body.lineHeight,
              },
            ]}
            numberOfLines={3}
          >
            {article.summary}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.sourceLink}
            onPress={() => {
              /* no-op */
            }}
          >
            <Text
              style={[
                styles.sourceLinkText,
                {
                  color: colors.primary.main,
                  fontFamily: typography.body.fontFamily,
                },
              ]}
            >
              {i18n.t("positionDetail.source")}
            </Text>
            <ExternalLinkIcon size={14} color={colors.primary.main} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  card: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  source: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  dot: {
    fontSize: 12,
  },
  timeAgo: {
    fontSize: 12,
  },
  summary: {
    fontSize: 14,
    marginBottom: 12,
  },
  sourceLink: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 4,
  },
  sourceLinkText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
