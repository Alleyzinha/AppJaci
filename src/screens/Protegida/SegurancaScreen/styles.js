import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },

  background: {
    flex: 1,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 20,
  },

  /*
   * CARD INTRODUTÓRIO
   */

  introCard: {
    width: '100%',
    minHeight: 135,
    borderRadius: 24,
    backgroundColor: '#EA5C97',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  introIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  introContent: {
    flex: 1,
  },

  introTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '900',
    marginBottom: 6,
  },

  introText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },

  /*
   * TÍTULO
   */

  titleContainer: {
    marginTop: 28,
    marginBottom: 14,
  },

  sectionTitle: {
    color: '#C92B91',
    fontSize: 20,
    fontWeight: '900',
  },

  sectionDescription: {
    marginTop: 5,
    color: '#806777',
    fontSize: 14,
  },

  /*
   * TEMAS
   */

  temasContainer: {
    width: '100%',
  },

  temaCard: {
    width: '100%',
    minHeight: 88,
    marginBottom: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,

    borderRadius: 21,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#F2D5E3',

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },

  temaCardPressed: {
    opacity: 0.82,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  temaIcon: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor: '#EA5C97',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  temaContent: {
    flex: 1,
    paddingRight: 8,
  },

  temaTitle: {
    color: '#C92B91',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 5,
  },

  temaDescription: {
    color: '#806777',
    fontSize: 13,
    lineHeight: 18,
  },

  bottomSpacing: {
    height: 10,
  },

  /*
   * MODAL
   */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 19, 31, 0.60)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  modalContainer: {
    width: '100%',
    maxHeight: '82%',
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    padding: 22,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },

  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  modalIcon: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor: '#EA5C97',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF0F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalTitle: {
    color: '#C92B91',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 4,
  },

  modalDescription: {
    color: '#806777',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 18,
  },

  tipsScroll: {
    maxHeight: 330,
  },

  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },

  tipNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EA5C97',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  tipNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  tipText: {
    flex: 1,
    color: '#4D3A46',
    fontSize: 15,
    lineHeight: 21,
    paddingTop: 3,
  },

  modalButton: {
    width: '100%',
    height: 52,
    borderRadius: 17,
    backgroundColor: '#EA5C97',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  modalButtonPressed: {
    opacity: 0.8,
  },

  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
