/**
 * app/component-gallery.tsx
 * 컴포넌트 갤러리 (Storybook 스타일)
 *
 * @description
 * - 공통 컴포넌트를 한눈에 확인할 수 있는 갤러리 페이지
 * - 각 컴포넌트의 모든 variant, size, state를 테스트
 * - 개발 환경에서만 사용 (프로덕션 빌드 시 제외 가능)
 */

import { Button } from '@/commons/components/button';
import { DualButton } from '@/commons/components/dual-button';
import { Colors } from '@/commons/constants';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ComponentGallery() {
  const [activeTab, setActiveTab] = useState<'button' | 'dualButton'>('button');

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white[500] }}>
      {/* 헤더 */}
      <View
        style={{
          paddingTop: 60,
          paddingBottom: 20,
          paddingHorizontal: 20,
          backgroundColor: Colors.black[500],
        }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.white[500] }}>
          컴포넌트 갤러리 📚
        </Text>
        <Text style={{ fontSize: 14, color: Colors.white[500], marginTop: 4, opacity: 0.8 }}>
          Storybook 스타일 컴포넌트 뷰어
        </Text>
      </View>

      {/* 탭 네비게이션 */}
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: Colors.whiteGrey[500],
          backgroundColor: Colors.white[500],
        }}>
        <TouchableOpacity
          onPress={() => setActiveTab('button')}
          style={{
            flex: 1,
            paddingVertical: 16,
            borderBottomWidth: 2,
            borderBottomColor: activeTab === 'button' ? Colors.black[500] : 'transparent',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontWeight: activeTab === 'button' ? 'bold' : 'normal',
              color: activeTab === 'button' ? Colors.black[500] : Colors.black[100],
            }}>
            Button
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('dualButton')}
          style={{
            flex: 1,
            paddingVertical: 16,
            borderBottomWidth: 2,
            borderBottomColor: activeTab === 'dualButton' ? Colors.black[500] : 'transparent',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontWeight: activeTab === 'dualButton' ? 'bold' : 'normal',
              color: activeTab === 'dualButton' ? Colors.black[500] : Colors.black[100],
            }}>
            DualButton
          </Text>
        </TouchableOpacity>
      </View>

      {/* 컨텐츠 */}
      <ScrollView style={{ flex: 1 }}>
        {activeTab === 'button' && <ButtonStories />}
        {activeTab === 'dualButton' && <DualButtonStories />}
      </ScrollView>
    </View>
  );
}

/**
 * Button 컴포넌트 스토리
 */
function ButtonStories() {
  return (
    <View style={{ padding: 20, gap: 32 }}>
      {/* 전체 Variant 한눈에 보기 */}
      <StorySection title="All Variants Overview" description="모든 variant와 size를 한눈에 비교">
        <View
          style={{
            padding: 16,
            backgroundColor: Colors.white[50],
            borderRadius: 12,
            borderWidth: 1,
            borderColor: Colors.whiteGrey[500],
            gap: 16,
          }}>
          {/* Primary Variant */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.black[500] }}>
              Primary (검은색 배경)
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button
                label="L"
                variant="primary"
                size="L"
                fullWidth={false}
                onPress={() => console.log('Primary L clicked')}
              />
              <Button
                label="M"
                variant="primary"
                size="M"
                fullWidth={false}
                onPress={() => console.log('Primary M clicked')}
              />
              <Button
                label="S"
                variant="primary"
                size="S"
                fullWidth={false}
                onPress={() => console.log('Primary S clicked')}
              />
            </View>
          </View>

          {/* Disabled Variant */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.black[500] }}>
              Disabled (회색 배경)
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button
                label="L"
                variant="disabled"
                size="L"
                fullWidth={false}
                onPress={() => console.log('Disabled L clicked')}
              />
              <Button
                label="M"
                variant="disabled"
                size="M"
                fullWidth={false}
                onPress={() => console.log('Disabled M clicked')}
              />
              <Button
                label="S"
                variant="disabled"
                size="S"
                fullWidth={false}
                onPress={() => console.log('Disabled S clicked')}
              />
            </View>
          </View>

          {/* Outline Variant */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.black[500] }}>
              Outline (흰색 배경 + 테두리)
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button
                label="L"
                variant="outline"
                size="L"
                fullWidth={false}
                onPress={() => console.log('Outline L clicked')}
              />
              <Button
                label="M"
                variant="outline"
                size="M"
                fullWidth={false}
                onPress={() => console.log('Outline M clicked')}
              />
              <Button
                label="S"
                variant="outline"
                size="S"
                fullWidth={false}
                onPress={() => console.log('Outline S clicked')}
              />
            </View>
          </View>

          {/* Danger Variant */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.black[500] }}>
              Danger (빨간색 배경)
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button
                label="L"
                variant="danger"
                size="L"
                fullWidth={false}
                onPress={() => console.log('Danger L clicked')}
              />
              <Button
                label="M"
                variant="danger"
                size="M"
                fullWidth={false}
                onPress={() => console.log('Danger M clicked')}
              />
              <Button
                label="S"
                variant="danger"
                size="S"
                fullWidth={false}
                onPress={() => console.log('Danger S clicked')}
              />
            </View>
          </View>
        </View>
      </StorySection>

      {/* Primary Variant 상세 */}
      <StorySection title="Primary Variant" description="검은색 배경의 주요 액션 버튼">
        <View style={{ gap: 12 }}>
          <StoryItem label="All Sizes">
            <View style={{ gap: 12 }}>
              <Button
                label="결제하기 (L)"
                variant="primary"
                size="L"
                onPress={() => console.log('Primary L clicked')}
              />
              <Button
                label="타임캡슐 묻기 (M)"
                variant="primary"
                size="M"
                onPress={() => console.log('Primary M clicked')}
              />
              <Button
                label="확인 (S)"
                variant="primary"
                size="S"
                onPress={() => console.log('Primary S clicked')}
              />
            </View>
          </StoryItem>

          <StoryItem label="With Icon">
            <View style={{ gap: 12 }}>
              <Button
                label="공유하기"
                variant="primary"
                size="M"
                icon="ri-share-line"
                iconPosition="left"
                onPress={() => console.log('Primary with icon clicked')}
              />
              <Button
                label="좋아요"
                variant="primary"
                size="M"
                icon="ri-heart-line"
                iconPosition="only"
                onPress={() => console.log('Primary icon only clicked')}
              />
            </View>
          </StoryItem>

          <StoryItem label="Disabled State">
            <Button
              label="비활성화"
              variant="primary"
              size="L"
              disabled
              onPress={() => console.log('This should not fire')}
            />
          </StoryItem>
        </View>
      </StorySection>

      {/* Disabled Variant 상세 */}
      <StorySection title="Disabled Variant" description="진한 회색 배경의 보조 액션 버튼">
        <View style={{ gap: 12 }}>
          <StoryItem label="All Sizes">
            <View style={{ gap: 12 }}>
              <Button
                label="취소 (L)"
                variant="disabled"
                size="L"
                onPress={() => console.log('Disabled L clicked')}
              />
              <Button
                label="다음에 하기 (M)"
                variant="disabled"
                size="M"
                onPress={() => console.log('Disabled M clicked')}
              />
              <Button
                label="닫기 (S)"
                variant="disabled"
                size="S"
                onPress={() => console.log('Disabled S clicked')}
              />
            </View>
          </StoryItem>

          <StoryItem label="Disabled State">
            <Button
              label="비활성화"
              variant="disabled"
              size="L"
              disabled
              onPress={() => console.log('This should not fire')}
            />
          </StoryItem>
        </View>
      </StorySection>

      {/* Outline Variant 상세 */}
      <StorySection title="Outline Variant" description="흰색 배경 + 검은색 테두리 버튼">
        <View style={{ gap: 12 }}>
          <StoryItem label="All Sizes">
            <View style={{ gap: 12 }}>
              <Button
                label="더 알아보기 (L)"
                variant="outline"
                size="L"
                onPress={() => console.log('Outline L clicked')}
              />
              <Button
                label="설정 (M)"
                variant="outline"
                size="M"
                onPress={() => console.log('Outline M clicked')}
              />
              <Button
                label="편집 (S)"
                variant="outline"
                size="S"
                onPress={() => console.log('Outline S clicked')}
              />
            </View>
          </StoryItem>

          <StoryItem label="With Icon">
            <Button
              label="내보내기"
              variant="outline"
              size="M"
              icon="ri-download-line"
              iconPosition="left"
              onPress={() => console.log('Outline with icon clicked')}
            />
          </StoryItem>

          <StoryItem label="Disabled State">
            <Button
              label="비활성화"
              variant="outline"
              size="L"
              disabled
              onPress={() => console.log('This should not fire')}
            />
          </StoryItem>
        </View>
      </StorySection>

      {/* Danger Variant 상세 */}
      <StorySection
        title="Danger Variant"
        description="빨간색 배경의 위험 액션 버튼 (삭제, 로그아웃 등)">
        <View style={{ gap: 12 }}>
          <StoryItem label="All Sizes">
            <View style={{ gap: 12 }}>
              <Button
                label="로그아웃 (L)"
                variant="danger"
                size="L"
                onPress={() => console.log('Danger L clicked')}
              />
              <Button
                label="삭제하기 (M)"
                variant="danger"
                size="M"
                onPress={() => console.log('Danger M clicked')}
              />
              <Button
                label="취소 (S)"
                variant="danger"
                size="S"
                onPress={() => console.log('Danger S clicked')}
              />
            </View>
          </StoryItem>

          <StoryItem label="Disabled State">
            <Button
              label="비활성화"
              variant="danger"
              size="L"
              disabled
              onPress={() => console.log('This should not fire')}
            />
          </StoryItem>
        </View>
      </StorySection>

      {/* Width Options */}
      <StorySection title="Width Options" description="전체 너비 vs 자동 너비">
        <View style={{ gap: 12 }}>
          <StoryItem label="Full Width (default)">
            <Button
              label="전체 너비 버튼"
              variant="primary"
              size="M"
              fullWidth={true}
              onPress={() => console.log('Full width clicked')}
            />
          </StoryItem>

          <StoryItem label="Auto Width">
            <Button
              label="자동 너비"
              variant="primary"
              size="M"
              fullWidth={false}
              onPress={() => console.log('Auto width clicked')}
            />
          </StoryItem>
        </View>
      </StorySection>
    </View>
  );
}

/**
 * DualButton 컴포넌트 스토리
 */
function DualButtonStories() {
  return (
    <View style={{ padding: 20, gap: 40 }}>
      <StorySection title="DualButton" description="취소 + 확인 듀얼 버튼">
        <View style={{ gap: 12 }}>
          <StoryItem label="Size: L (64px)">
            <DualButton
              cancelLabel="취소"
              confirmLabel="저장"
              size="L"
              onCancelPress={() => console.log('Cancel L clicked')}
              onConfirmPress={() => console.log('Confirm L clicked')}
            />
          </StoryItem>

          <StoryItem label="Size: M (56px)">
            <DualButton
              cancelLabel="취소"
              confirmLabel="묻기"
              size="M"
              onCancelPress={() => console.log('Cancel M clicked')}
              onConfirmPress={() => console.log('Confirm M clicked')}
            />
          </StoryItem>

          <StoryItem label="Size: S (48px)">
            <DualButton
              cancelLabel="취소"
              confirmLabel="확인"
              size="S"
              onCancelPress={() => console.log('Cancel S clicked')}
              onConfirmPress={() => console.log('Confirm S clicked')}
            />
          </StoryItem>
        </View>
      </StorySection>

      <StorySection title="Disabled States" description="비활성화 상태 예시">
        <View style={{ gap: 12 }}>
          <StoryItem label="Confirm Disabled (Size: L)">
            <DualButton
              cancelLabel="취소"
              confirmLabel="저장"
              size="L"
              confirmDisabled={true}
              onCancelPress={() => console.log('Cancel clicked')}
              onConfirmPress={() => console.log('This should not fire')}
            />
          </StoryItem>

          <StoryItem label="Confirm Disabled (Size: M)">
            <DualButton
              cancelLabel="취소"
              confirmLabel="확인"
              size="M"
              confirmDisabled={true}
              onCancelPress={() => console.log('Cancel clicked')}
              onConfirmPress={() => console.log('This should not fire')}
            />
          </StoryItem>

          <StoryItem label="Confirm Disabled (Size: S)">
            <DualButton
              cancelLabel="취소"
              confirmLabel="확인"
              size="S"
              confirmDisabled={true}
              onCancelPress={() => console.log('Cancel clicked')}
              onConfirmPress={() => console.log('This should not fire')}
            />
          </StoryItem>

          <StoryItem label="Note: 취소 버튼은 항상 활성화 (outline variant)">
            <DualButton
              cancelLabel="취소"
              confirmLabel="확인"
              size="M"
              onCancelPress={() => console.log('Cancel clicked')}
              onConfirmPress={() => console.log('Confirm clicked')}
            />
          </StoryItem>
        </View>
      </StorySection>

      <StorySection title="Use Cases" description="실제 사용 예시">
        <View style={{ gap: 12 }}>
          <StoryItem label="바텀시트 (저장/취소)">
            <DualButton
              cancelLabel="취소"
              confirmLabel="저장하기"
              size="L"
              onCancelPress={() => console.log('Cancel clicked')}
              onConfirmPress={() => console.log('Save clicked')}
            />
          </StoryItem>

          <StoryItem label="모달 (타임캡슐 묻기)">
            <DualButton
              cancelLabel="취소"
              confirmLabel="타임캡슐 묻기"
              size="M"
              onCancelPress={() => console.log('Cancel clicked')}
              onConfirmPress={() => console.log('Bury clicked')}
            />
          </StoryItem>

          <StoryItem label="삭제 확인">
            <DualButton
              cancelLabel="아니오"
              confirmLabel="삭제"
              size="S"
              onCancelPress={() => console.log('Cancel clicked')}
              onConfirmPress={() => console.log('Delete clicked')}
            />
          </StoryItem>
        </View>
      </StorySection>
    </View>
  );
}

/**
 * 스토리 섹션 컴포넌트
 */
function StorySection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <View>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.black[500] }}>{title}</Text>
        <Text style={{ fontSize: 14, color: Colors.black[100], marginTop: 4 }}>{description}</Text>
      </View>
      {children}
    </View>
  );
}

/**
 * 스토리 아이템 컴포넌트
 */
function StoryItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View
      style={{
        padding: 16,
        backgroundColor: Colors.white[50], // 흰색 배경으로 변경
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.whiteGrey[500], // 테두리 추가
        gap: 8,
      }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.black[300] }}>{label}</Text>
      {children}
    </View>
  );
}
