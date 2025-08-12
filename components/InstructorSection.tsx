'use client';

import { motion } from 'framer-motion';
import { Award, Users, TrendingUp, Star, CheckCircle, Target } from 'lucide-react';

interface Achievement {
  icon: any;
  title: string;
  description: string;
  value?: string;
}

interface Instructor {
  name: string;
  title: string;
  bio: string;
  profileImage?: string;
  achievements: Achievement[];
  stats: {
    students: number;
    courses: number;
    rating: number;
    experience: string;
  };
  specialties: string[];
  credentials: string[];
}

export const InstructorSection = ({
  instructor,
  className = '',
}: {
  instructor: Instructor;
  className?: string;
}) => {
  return (
    <section className={`py-20 ${className}`}>
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-offWhite-200 mb-4">강사 소개</h2>
          <p className="text-lg text-offWhite-500">실제 경험과 검증된 노하우를 전달하는 전문가</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* 강사 프로필 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-deepBlack-600/30 rounded-3xl p-8 border border-metallicGold-500/20"
          >
            {/* 프로필 헤더 */}
            <div className="text-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-metallicGold-500 to-metallicGold-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-bold text-deepBlack-900">
                  {instructor.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-offWhite-200 mb-2">{instructor.name}</h3>
              <p className="text-metallicGold-500 font-semibold text-lg mb-4">{instructor.title}</p>

              {/* 통계 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {instructor.stats.students.toLocaleString()}+
                  </div>
                  <div className="text-xs text-offWhite-500">수강생</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {instructor.stats.courses}+
                  </div>
                  <div className="text-xs text-offWhite-500">강의</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {instructor.stats.rating}
                  </div>
                  <div className="text-xs text-offWhite-500">평점</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-metallicGold-500 mb-1">
                    {instructor.stats.experience}
                  </div>
                  <div className="text-xs text-offWhite-500">경력</div>
                </div>
              </div>
            </div>

            {/* 소개 */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-offWhite-200 mb-4">소개</h4>
              <p className="text-offWhite-400 leading-relaxed whitespace-pre-line">
                {instructor.bio}
              </p>
            </div>

            {/* 전문 분야 */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-offWhite-200 mb-4">전문 분야</h4>
              <div className="flex flex-wrap gap-2">
                {instructor.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-metallicGold-500/20 text-metallicGold-500 px-3 py-1 rounded-full text-sm font-semibold border border-metallicGold-500/30"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* 자격증/인증 */}
            <div>
              <h4 className="text-lg font-bold text-offWhite-200 mb-4">자격 및 인증</h4>
              <div className="space-y-2">
                {instructor.credentials.map((credential, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-offWhite-400 text-sm">{credential}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 주요 성과 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-offWhite-200 mb-8">주요 성과 및 경험</h3>

            {instructor.achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-deepBlack-600/30 rounded-2xl p-6 border border-offWhite-800/20 hover:border-metallicGold-500/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-metallicGold-500/20 to-metallicGold-700/20 border border-metallicGold-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <achievement.icon className="w-6 h-6 text-metallicGold-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-xl font-bold text-offWhite-200">{achievement.title}</h4>
                      {achievement.value && (
                        <span className="text-metallicGold-500 font-bold text-lg">
                          {achievement.value}
                        </span>
                      )}
                    </div>
                    <p className="text-offWhite-400 leading-relaxed">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 강사의 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-br from-metallicGold-500/10 to-metallicGold-900/10 rounded-3xl p-8 border border-metallicGold-500/30"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-metallicGold-500 mb-6">강사의 메시지</h3>
            <blockquote className="text-lg text-offWhite-300 leading-relaxed max-w-4xl mx-auto">
              "저는 여러분과 같은 비개발자였습니다. 코딩을 모르는 상황에서 AI의 힘을 빌려 원하는
              결과를 만들어내는 방법을 터득했고, 그 과정에서 얻은 노하우를 아낌없이 공유하고자
              합니다.
              <br />
              <br />
              복잡한 이론보다는{' '}
              <strong className="text-metallicGold-500">실제로 써먹을 수 있는 실무 중심</strong>의
              내용으로 구성했으며, 여러분이{' '}
              <strong className="text-metallicGold-500">
                단 한 번의 강의로 평생 활용할 수 있는 스킬
              </strong>
              을 얻어가시길 바랍니다."
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-offWhite-500">수강생 만족도 98%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// 샘플 강사 데이터
export const sampleInstructor: Instructor = {
  name: '떡상연구소 대표',
  title: 'AI 자동화 전문가 & 비개발자 출신 창업가',
  bio: `15년간 비개발자로 일하다가 AI의 등장과 함께 인생이 완전히 바뀌었습니다.

복잡한 프로그래밍 언어를 배우는 대신, AI를 활용해 원하는 결과를 얻는 '효율적인 길'을 찾았고, 이를 통해 월 수익 8자리를 달성했습니다.

현재는 비개발자들이 AI를 제대로 활용할 수 있도록 돕는 일에 집중하고 있으며, 복잡한 개발 지식 없이도 실용적인 자동화 시스템을 만드는 방법을 전파하고 있습니다.`,
  stats: {
    students: 2847,
    courses: 3,
    rating: 4.9,
    experience: '5년+',
  },
  specialties: [
    'AI 자동화',
    '노코드 개발',
    '텔레그램 봇',
    'Claude Code',
    '비즈니스 자동화',
    '프롬프트 엔지니어링',
  ],
  credentials: [
    '떡상연구소 대표',
    'AI 자동화 컨설턴트',
    '비개발자 대상 AI 교육 전문가',
    '월 매출 8자리 달성',
    '2,800+ 수강생 보유',
  ],
  achievements: [
    {
      icon: TrendingUp,
      title: '월 매출 8자리 달성',
      description:
        'AI 자동화 도구를 활용해 비개발자임에도 불구하고 안정적인 수익 구조를 만들었습니다.',
      value: '월 1,000만원+',
    },
    {
      icon: Users,
      title: '2,800+ 수강생 배출',
      description: '지금까지 2,800명 이상의 비개발자들이 AI 자동화 기술을 성공적으로 학습했습니다.',
      value: '2,847명',
    },
    {
      icon: Award,
      title: '수강생 만족도 98%',
      description:
        '실무 중심의 커리큘럼과 1:1 멘토링으로 매우 높은 수강생 만족도를 유지하고 있습니다.',
      value: '98%',
    },
    {
      icon: Target,
      title: '실전 프로젝트 완성률',
      description:
        '강의를 완주한 수강생 중 95%가 자신만의 자동화 프로그램을 성공적으로 완성했습니다.',
      value: '95%',
    },
  ],
};
