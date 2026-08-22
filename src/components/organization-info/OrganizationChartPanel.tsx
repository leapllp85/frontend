"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import { Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { ChevronDown, Crosshair, Minus, MoreVertical, Plus } from "lucide-react";
import {
  organizationChartRoot,
  organizationRiskStyles,
  type OrganizationPerson,
  type OrganizationRiskLevel,
} from "./organizationInfoData";
import { cardBorder, cardRadius, cardShadow, colors } from "@/types/styles";

const baseCanvasWidth = 1068;
const baseCanvasHeight = 548;
const connectorColor = "#AEBCE2";
const minZoom = 0.45;
const maxZoom = 1.16;

const riskLegend: readonly OrganizationRiskLevel[] = ["low", "medium", "high"];

type ChartVariant = "self" | "direct" | "report";

type PositionedPerson = {
  person: OrganizationPerson;
  variant: ChartVariant;
  x: number;
  y: number;
  hasChildIndicator: boolean;
  isExpanded: boolean;
};

const cardSizes: Record<ChartVariant, { width: number; height: number }> = {
  self: { width: 242, height: 108 },
  direct: { width: 220, height: 92 },
  report: { width: 212, height: 92 },
};

const chartLayout = {
  topPadding: 36,
  leftPadding: 52,
  rightPadding: 52,
  bottomPadding: 42,
  directLevelGap: 190,
  nestedLevelGap: 188,
  directGap: 44,
  reportGap: 50,
};

type PanState = {
  pointerId: number;
  startX: number;
  startY: number;
  scrollLeft: number;
  scrollTop: number;
};

type VisiblePersonNode = {
  person: OrganizationPerson;
  depth: number;
  variant: ChartVariant;
  hasChildIndicator: boolean;
  isExpanded: boolean;
  children: VisiblePersonNode[];
};

type MeasuredPersonNode = Omit<VisiblePersonNode, "children"> & {
  children: MeasuredPersonNode[];
  subtreeWidth: number;
};

function hasChildren(person: OrganizationPerson) {
  return Boolean(person.reports?.length || person.hasCollapsedReports);
}

function getVariant(depth: number): ChartVariant {
  if (depth === 0) {
    return "self";
  }

  if (depth === 1) {
    return "direct";
  }

  return "report";
}

function getNodeY(depth: number) {
  if (depth === 0) {
    return chartLayout.topPadding;
  }

  return chartLayout.topPadding + chartLayout.directLevelGap + (depth - 1) * chartLayout.nestedLevelGap;
}

function getChildGap(depth: number) {
  return depth === 0 ? chartLayout.directGap : chartLayout.reportGap;
}

function getCenterX(node: PositionedPerson) {
  return node.x + cardSizes[node.variant].width / 2;
}

function getBottomY(node: PositionedPerson) {
  return node.y + cardSizes[node.variant].height;
}

function createLevelConnectors(parentNode: PositionedPerson, childNodes: readonly PositionedPerson[], branchY: number) {
  if (childNodes.length === 0) {
    return [];
  }

  const firstChildCenter = getCenterX(childNodes[0]);
  const lastChildCenter = getCenterX(childNodes[childNodes.length - 1]);
  const parentCenter = getCenterX(parentNode);
  const parentBottom = getBottomY(parentNode);

  return [
    `M${parentCenter} ${parentBottom} V${branchY}`,
    `M${firstChildCenter} ${branchY} H${lastChildCenter}`,
    ...childNodes.map((childNode) => `M${getCenterX(childNode)} ${branchY} V${childNode.y}`),
  ];
}

function createVisibleTree(
  person: OrganizationPerson,
  expandedNodeIds: ReadonlySet<string>,
  seenPersonIds: Set<string>,
  depth = 0,
): VisiblePersonNode {
  const isExpanded = depth === 0 || expandedNodeIds.has(person.id);
  const children: VisiblePersonNode[] = [];

  if (isExpanded) {
    (person.reports ?? []).forEach((report) => {
      if (seenPersonIds.has(report.id)) {
        return;
      }

      seenPersonIds.add(report.id);
      children.push(createVisibleTree(report, expandedNodeIds, seenPersonIds, depth + 1));
    });
  }

  return {
    person,
    depth,
    variant: getVariant(depth),
    hasChildIndicator: depth > 0 && hasChildren(person),
    isExpanded,
    children,
  };
}

function measureVisibleTree(node: VisiblePersonNode): MeasuredPersonNode {
  const children = node.children.map(measureVisibleTree);
  const childGap = getChildGap(node.depth);
  const childrenWidth =
    children.reduce((totalWidth, child) => totalWidth + child.subtreeWidth, 0) +
    Math.max(0, children.length - 1) * childGap;
  const cardWidth = cardSizes[node.variant].width;

  return {
    ...node,
    children,
    subtreeWidth: Math.max(cardWidth, childrenWidth),
  };
}

function buildChartLayout(root: OrganizationPerson, expandedNodeIds: ReadonlySet<string>) {
  const positionedPeople: PositionedPerson[] = [];
  const connectorPaths: string[] = [];
  let maxDepth = 0;
  const visibleTree = createVisibleTree(root, expandedNodeIds, new Set([root.id]));
  const measuredTree = measureVisibleTree(visibleTree);

  function positionNode(node: MeasuredPersonNode, leftX: number): PositionedPerson {
    const cardSize = cardSizes[node.variant];
    const positionedNode: PositionedPerson = {
      person: node.person,
      variant: node.variant,
      x: leftX + (node.subtreeWidth - cardSize.width) / 2,
      y: getNodeY(node.depth),
      hasChildIndicator: node.hasChildIndicator,
      isExpanded: node.isExpanded,
    };

    positionedPeople.push(positionedNode);
    maxDepth = Math.max(maxDepth, node.depth);

    if (node.children.length > 0) {
      const childGap = getChildGap(node.depth);
      const childrenWidth =
        node.children.reduce((totalWidth, child) => totalWidth + child.subtreeWidth, 0) +
        Math.max(0, node.children.length - 1) * childGap;
      let childLeftX = leftX + (node.subtreeWidth - childrenWidth) / 2;
      const childNodes = node.children.map((child) => {
        const childNode = positionNode(child, childLeftX);
        childLeftX += child.subtreeWidth + childGap;

        return childNode;
      });
      const branchY = getBottomY(positionedNode) + (childNodes[0].y - getBottomY(positionedNode)) / 2;

      connectorPaths.push(...createLevelConnectors(positionedNode, childNodes, branchY));
    }

    return positionedNode;
  }

  positionNode(measuredTree, chartLayout.leftPadding);

  const deepestCardBottom = Math.max(
    ...positionedPeople.map((node) => getBottomY(node)),
    getNodeY(maxDepth),
  );
  const canvasWidth = Math.max(
    baseCanvasWidth,
    chartLayout.leftPadding + measuredTree.subtreeWidth + chartLayout.rightPadding,
  );
  const canvasHeight = Math.max(baseCanvasHeight, deepestCardBottom + chartLayout.bottomPadding);

  return { canvasWidth, canvasHeight, connectorPaths, positionedPeople };
}

function RiskBadge({ riskLevel }: { riskLevel: OrganizationRiskLevel }) {
  const style = organizationRiskStyles[riskLevel];

  return (
    <Box
      h="22px"
      px="9px"
      borderRadius="5px"
      bg={style.bg}
      color={style.color}
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize="11px"
      fontWeight="800"
      lineHeight="1"
      textTransform="uppercase"
      whiteSpace="nowrap"
    >
      {style.label}
    </Box>
  );
}

function PersonAvatar({ person, variant }: { person: OrganizationPerson; variant: ChartVariant }) {
  const size = variant === "self" ? "72px" : "54px";

  return (
    <Box
      w={size}
      h={size}
      borderRadius="full"
      bg={`linear-gradient(135deg, ${colors.primarySoft} 0%, #FFF3DE 100%)`}
      bgImage={`url(${person.avatarUrl})`}
      bgSize="cover"
      backgroundPosition="center"
      border="1px solid"
      borderColor={colors.lightBorder}
      flexShrink={0}
    />
  );
}

function PersonCard({
  node,
  onToggleChildren,
  onSelect,
  isSelected,
}: {
  node: PositionedPerson;
  onToggleChildren: (person: OrganizationPerson) => void;
  onSelect?: (person: OrganizationPerson) => void;
  isSelected?: boolean;
}) {
  const { person, variant } = node;
  const riskStyle = organizationRiskStyles[person.riskLevel];
  const isSelf = variant === "self";
  const cardWidth = `${cardSizes[variant].width}px`;
  const cardHeight = `${cardSizes[variant].height}px`;

  return (
    <Box
      position="absolute"
      left={`${node.x}px`}
      top={`${node.y}px`}
      w={cardWidth}
      h={cardHeight}
      bg={colors.surface}
      border={isSelf ? "1.5px solid" : "1px solid"}
      borderColor={isSelf ? colors.primary : colors.border}
      borderRadius="10px"
      boxShadow={isSelf ? "0 16px 36px rgba(29, 127, 227, 0.16)" : cardShadow}
      overflow="visible"
      zIndex={2}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-pressed={onSelect ? Boolean(isSelected) : undefined}
      cursor={onSelect ? "pointer" : "default"}
      outline="none"
      onClick={() => onSelect?.(person)}
      onKeyDown={(event) => {
        if (!onSelect || (event.key !== "Enter" && event.key !== " ")) {
          return;
        }

        event.preventDefault();
        onSelect(person);
      }}
      data-chart-interactive="true"
    >
      {!isSelf && (
        <Box
          position="absolute"
          left="0"
          top="14px"
          bottom="14px"
          w="3px"
          borderRadius="999px"
          bg={riskStyle.color}
        />
      )}

      <HStack h="full" px={isSelf ? "16px" : "14px"} gap={isSelf ? "16px" : "13px"} align="center">
        <PersonAvatar person={person} variant={variant} />

        <VStack align="flex-start" gap={isSelf ? "8px" : "6px"} minW={0} flex="1">
          <HStack w="full" justify="space-between" gap="10px" align="flex-start" minW={0}>
            <VStack align="flex-start" gap="5px" minW={0} maxW="full" flex="1">
              <Text
                color={colors.primaryText}
                fontSize={isSelf ? "18px" : "13px"}
                fontWeight="800"
                lineHeight="1.15"
                w="full"
                truncate
              >
                {person.name}
              </Text>
              <Text
                color={colors.secondaryText}
                fontSize={isSelf ? "12px" : "10px"}
                fontWeight="600"
                lineHeight="1.25"
                w="full"
                truncate
              >
                {person.role}
              </Text>
            </VStack>

            {!isSelf && (
              <Box color={colors.secondaryText} mt="1px" flexShrink={0}>
                <MoreVertical size={16} />
              </Box>
            )}
          </HStack>

          <RiskBadge riskLevel={person.riskLevel} />
        </VStack>
      </HStack>

      {node.hasChildIndicator && (
        <Box
          as="button"
          aria-label={`${node.isExpanded ? "Collapse" : "Expand"} ${person.name} reports`}
          position="absolute"
          left="50%"
          bottom="-18px"
          transform="translateX(-50%)"
          w="24px"
          h="24px"
          borderRadius="full"
          bg={colors.surface}
          border="1px solid"
          borderColor={colors.lightBorder}
          color={colors.primary}
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 6px 18px rgba(11, 12, 28, 0.08)"
          cursor={person.reports?.length ? "pointer" : "default"}
          zIndex={4}
          onClick={(event) => {
            event.stopPropagation();
            onToggleChildren(person);
          }}
          data-chart-interactive="true"
        >
          <ChevronDown
            size={15}
            style={{
              transform: node.isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 160ms ease",
            }}
          />
        </Box>
      )}
    </Box>
  );
}

type OrganizationChartPanelProps = {
  selectedEmployeeId?: string | null;
  onEmployeeSelect?: (employee: OrganizationPerson) => void;
};

function ChartControls({
  onFit,
  onZoomIn,
  onZoomOut,
}: {
  onFit: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}) {
  return (
    <VStack
      position="absolute"
      left="22px"
      top="22px"
      zIndex={5}
      gap={0}
      bg={colors.surface}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="10px"
      boxShadow="0 12px 28px rgba(11, 12, 28, 0.08)"
      overflow="hidden"
    >
      {[
        { label: "Zoom in", icon: Plus, action: onZoomIn },
        { label: "Zoom out", icon: Minus, action: onZoomOut },
        { label: "Fit chart", icon: Crosshair, action: onFit },
      ].map((control, index) => {
        const Icon = control.icon;

        return (
          <IconButton
            key={control.label}
            aria-label={control.label}
            h="38px"
            w="38px"
            minW="38px"
            bg={colors.surface}
            color={colors.primaryText}
            borderRadius="0"
            borderBottom={index === 2 ? "0" : "1px solid"}
            borderColor={colors.lightBorder}
            _hover={{ bg: colors.primarySoft }}
            onClick={control.action}
          >
            <Icon size={17} />
          </IconButton>
        );
      })}
    </VStack>
  );
}

function RiskLegend() {
  return (
    <HStack position="absolute" right="26px" top="28px" zIndex={5} gap="20px">
      {riskLegend.map((risk) => {
        const style = organizationRiskStyles[risk];

        return (
          <HStack key={risk} gap="8px">
            <Box w="8px" h="8px" borderRadius="full" bg={style.color} />
            <Text color={colors.secondaryText} fontSize="12px" fontWeight="700">
              {style.label}
            </Text>
          </HStack>
        );
      })}
    </HStack>
  );
}

export function OrganizationChartPanel({
  selectedEmployeeId,
  onEmployeeSelect,
}: OrganizationChartPanelProps) {
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const panStateRef = useRef<PanState | null>(null);
  const [expandedNodeIds, setExpandedNodeIds] = useState<ReadonlySet<string>>(
    () => new Set(["david-lee"]),
  );
  const { canvasWidth, canvasHeight, connectorPaths, positionedPeople } = useMemo(
    () => buildChartLayout(organizationChartRoot, expandedNodeIds),
    [expandedNodeIds],
  );
  const fitChartToViewport = () => {
    const viewport = viewportRef.current;

    if (!viewport) {
      setZoom(1);
      return;
    }

    const availableWidth = Math.max(320, viewport.clientWidth - 36);
    const availableHeight = Math.max(320, viewport.clientHeight - 36);
    const fitScale = Math.min(1, availableWidth / canvasWidth, availableHeight / canvasHeight);
    const nextZoom = Number(Math.max(minZoom, Math.min(1, fitScale)).toFixed(2));

    setZoom(nextZoom);

    window.requestAnimationFrame(() => {
      viewport.scrollLeft = Math.max(0, (canvasWidth * nextZoom - viewport.clientWidth) / 2);
      viewport.scrollTop = 0;
    });
  };

  const toggleNode = (person: OrganizationPerson) => {
    if (!person.reports?.length) {
      return;
    }

    setExpandedNodeIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(person.id)) {
        nextIds.delete(person.id);
      } else {
        nextIds.add(person.id);
      }

      return nextIds;
    });
  };
  const handlePanStart = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.closest("[data-chart-interactive='true']")) {
      return;
    }

    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    panStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: viewport.scrollLeft,
      scrollTop: viewport.scrollTop,
    };
    setIsPanning(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePanMove = (event: PointerEvent<HTMLDivElement>) => {
    const panState = panStateRef.current;
    const viewport = viewportRef.current;

    if (!panState || !viewport || panState.pointerId !== event.pointerId) {
      return;
    }

    viewport.scrollLeft = panState.scrollLeft - (event.clientX - panState.startX);
    viewport.scrollTop = panState.scrollTop - (event.clientY - panState.startY);
  };
  const handlePanEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (panStateRef.current?.pointerId === event.pointerId) {
      panStateRef.current = null;
      setIsPanning(false);
    }
  };

  return (
    <Box
      bg={colors.surface}
      border={cardBorder}
      borderColor={colors.border}
      borderRadius={cardRadius}
      boxShadow={cardShadow}
      minH={{ base: "560px", xl: "590px" }}
      overflow="hidden"
      position="relative"
    >
      <ChartControls
        onFit={fitChartToViewport}
        onZoomIn={() => setZoom((value) => Math.min(maxZoom, Number((value + 0.06).toFixed(2))))}
        onZoomOut={() => setZoom((value) => Math.max(minZoom, Number((value - 0.06).toFixed(2))))}
      />
      <RiskLegend />

      <Box
        ref={viewportRef}
        h="full"
        minH={{ base: "560px", xl: "590px" }}
        overflow="auto"
        overscrollBehavior="contain"
        px="18px"
        py="18px"
        cursor={isPanning ? "grabbing" : "grab"}
        onPointerDown={handlePanStart}
        onPointerMove={handlePanMove}
        onPointerUp={handlePanEnd}
        onPointerCancel={handlePanEnd}
      >
        <Box
          position="relative"
          w={`${canvasWidth * zoom}px`}
          h={`${canvasHeight * zoom}px`}
          minW="100%"
          minH="100%"
        >
          <Box
            position="absolute"
            left="0"
            top="0"
            w={`${canvasWidth}px`}
            h={`${canvasHeight}px`}
            transform={`scale(${zoom})`}
            transformOrigin="top left"
            bgImage="radial-gradient(circle, #E6EAF0 1px, transparent 1px)"
            bgSize="20px 20px"
            borderRadius="10px"
          >
            <svg
              width={canvasWidth}
              height={canvasHeight}
              viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
            >
              {connectorPaths.map((path) => (
                <path
                  key={path}
                  d={path}
                  fill="none"
                  stroke={connectorColor}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </svg>

            {positionedPeople.map((node) => (
              <PersonCard
                key={node.person.id}
                node={node}
                onToggleChildren={toggleNode}
                onSelect={onEmployeeSelect}
                isSelected={selectedEmployeeId === node.person.id}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
