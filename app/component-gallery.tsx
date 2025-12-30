/**
 * app/component-gallery.tsx
 * 컴포넌트 갤러리 (Storybook 스타일)
 *
 * @description
 * - 공통 컴포넌트를 한눈에 확인할 수 있는 갤러리 페이지
 * - 각 컴포넌트의 모든 variant, size, state를 테스트
 * - 개발 환경에서만 사용 (프로덕션 빌드 시 제외 가능)
 */

import { Button, DualButton } from '@/commons/components/button';
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
    <View style={{ padding: 20, gap: 40 }}>
      {/* Primary Variant */}
      <StorySection title="Primary Variant" description="검은색 배경의 주요 액션 버튼">
        <View style={{ gap: 12 }}>
          <StoryItem label="Size: L (64px)">
            <Button
              label="결제하기"
              variant="primary"
              size="L"
              onPress={() => console.log('Primary L clicked')}
            />
            <Text style={{ color: 'blue', fontSize: 10, marginTop: 4 }}>
              ↑ 여기에 검은 버튼이 보여야 함
            </Text>
          </StoryItem>

          <StoryItem label="Size: M (56px)">
            <Button
              label="타임캡슐 묻기"
              variant="primary"
              size="M"
              onPress={() => console.log('Primary M clicked')}
            />
          </StoryItem>

          <StoryItem label="Size: S (48px)">
            <Button
              label="확인"
              variant="primary"
              size="S"
              onPress={() => console.log('Primary S clicked')}
            />
          </StoryItem>

          <StoryItem label="With Icon (Left)">
            <Button
              label="공유하기"
              variant="primary"
              size="M"
              icon="ri-share-line"
              iconPosition="left"
              onPress={() => console.log('Primary with icon clicked')}
            />
          </StoryItem>

          <StoryItem label="Icon Only">
            <Button
              label="좋아요"
              variant="primary"
              size="M"
              icon="ri-heart-line"
              iconPosition="only"
              onPress={() => console.log('Primary icon only clicked')}
            />
          </StoryItem>

          <StoryItem label="Disabled">
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

      {/* Secondary Variant */}
      <StorySection title="Secondary Variant" description="회색 배경의 보조 액션 버튼">
        <View style={{ gap: 12 }}>
          <StoryItem label="Size: L (64px)">
            <Button
              label="취소"
              variant="secondary"
              size="L"
              onPress={() => console.log('Secondary L clicked')}
            />
          </StoryItem>

          <StoryItem label="Size: M (56px)">
            <Button
              label="다음에 하기"
              variant="secondary"
              size="M"
              onPress={() => console.log('Secondary M clicked')}
            />
          </StoryItem>

          <StoryItem label="Size: S (48px)">
            <Button
              label="닫기"
              variant="secondary"
              size="S"
              onPress={() => console.log('Secondary S clicked')}
            />
          </StoryItem>

          <StoryItem label="Disabled">
            <Button
              label="비활성화"
              variant="secondary"
              size="L"
              disabled
              onPress={() => console.log('This should not fire')}
            />
          </StoryItem>
        </View>
      </StorySection>

      {/* Outline Variant */}
      <StorySection title="Outline Variant" description="흰색 배경 + 검은색 테두리 버튼">
        <View style={{ gap: 12 }}>
          <StoryItem label="Size: L (64px)">
            <Button
              label="더 알아보기"
              variant="outline"
              size="L"
              onPress={() => console.log('Outline L clicked')}
            />
          </StoryItem>

          <StoryItem label="Size: M (56px)">
            <Button
              label="설정"
              variant="outline"
              size="M"
              onPress={() => console.log('Outline M clicked')}
            />
          </StoryItem>

          <StoryItem label="Size: S (48px)">
            <Button
              label="편집"
              variant="outline"
              size="S"
              onPress={() => console.log('Outline S clicked')}
            />
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

          <StoryItem label="Disabled">
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

      {/* Full Width vs Auto Width */}
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

          <StoryItem label="Cancel Disabled">
            <DualButton
              cancelLabel="취소"
              confirmLabel="확인"
              size="M"
              cancelDisabled={true}
              onCancelPress={() => console.log('This should not fire')}
              onConfirmPress={() => console.log('Confirm clicked')}
            />
          </StoryItem>

          <StoryItem label="Confirm Disabled">
            <DualButton
              cancelLabel="취소"
              confirmLabel="확인"
              size="M"
              confirmDisabled={true}
              onCancelPress={() => console.log('Cancel clicked')}
              onConfirmPress={() => console.log('This should not fire')}
            />
          </StoryItem>

          <StoryItem label="Both Disabled">
            <DualButton
              cancelLabel="취소"
              confirmLabel="확인"
              size="M"
              cancelDisabled={true}
              confirmDisabled={true}
              onCancelPress={() => console.log('This should not fire')}
              onConfirmPress={() => console.log('This should not fire')}
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
